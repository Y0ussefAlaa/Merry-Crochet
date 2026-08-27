import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { createImagePath, storageService } from './storage.service';
import type { Product } from "../types/product";

const FIREBASE_OPERATION_TIMEOUT_MS = 30000;

const withTimeout = async <T>(operation: Promise<T>, message: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), FIREBASE_OPERATION_TIMEOUT_MS);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const formatProductDoc = (docSnap: { id: string; data: () => any }): Product => {
  const data = docSnap.data();
  let createdAtStr = new Date().toISOString();
  if (data.createdAt?.toDate) {
    createdAtStr = data.createdAt.toDate().toISOString();
  } else if (typeof data.createdAt === 'string') {
    createdAtStr = data.createdAt;
  } else if (data.createdAt?.seconds) {
    createdAtStr = new Date(data.createdAt.seconds * 1000).toISOString();
  }

  return {
    id: docSnap.id,
    name: data.name || '',
    description: data.description || '',
    price: Number(data.price) || 0,
    image: data.image || '',
    category: data.category || '',
    stock: typeof data.stock === 'number' ? data.stock : 0,
    availability: data.availability || 'in-stock',
    createdAt: createdAtStr,
  };
};

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => formatProductDoc(docSnap));
    } catch (error: any) {
      console.error("Error fetching products from Firestore:", error);
      // Fallback query without orderBy if index is still building or missing
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const products = snapshot.docs.map((docSnap) => formatProductDoc(docSnap));
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (fallbackError) {
        console.error("Fallback products fetch failed:", fallbackError);
        throw error;
      }
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const docSnap = await getDoc(doc(db, "products", id));
      if (!docSnap.exists()) return null;
      return formatProductDoc(docSnap);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  uploadImage: async (file: File, path = createImagePath(file, 'products')): Promise<string> => {
    try {
      await withTimeout(
        storageService.uploadImage(file, path),
        'Image upload timed out. Check Supabase Storage policies and your connection.'
      );
      return storageService.getPublicUrl(path);
    } catch (error) {
      console.error("Error uploading product image to Supabase Storage:", error);
      throw error;
    }
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    try {
      const payload: Record<string, any> = {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        image: productData.image,
        stock: Number(productData.stock),
        availability: productData.availability,
        createdAt: serverTimestamp(),
      };

      if (productData.category) {
        payload.category = productData.category;
      }

      const docRef = await withTimeout(
        addDoc(collection(db, "products"), payload),
        'Saving the product timed out. Check Firestore rules and your connection.'
      );
      return {
        ...productData,
        id: docRef.id,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating product in Firestore:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const productRef = doc(db, "products", id);
      const updatePayload: Record<string, any> = {};

      if (productData.name !== undefined) updatePayload.name = productData.name;
      if (productData.description !== undefined) updatePayload.description = productData.description;
      if (productData.price !== undefined) updatePayload.price = Number(productData.price);
      if (productData.image !== undefined) updatePayload.image = productData.image;
      if (productData.stock !== undefined) updatePayload.stock = Number(productData.stock);
      if (productData.availability !== undefined) updatePayload.availability = productData.availability;
      if (productData.category !== undefined) updatePayload.category = productData.category;

      await updateDoc(productRef, updatePayload);
      const updatedSnap = await getDoc(productRef);
      if (!updatedSnap.exists()) {
        throw new Error("Product not found after update.");
      }
      return formatProductDoc(updatedSnap);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};
