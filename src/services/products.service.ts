import { mockProducts } from '../data/mockProducts';
import type { Product } from '../types/product';

// Local storage key for persistent mock product modifications in Stage 1
const STORAGE_KEY = 'merry_crochet_mock_products';

const getStoredProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading stored products', e);
  }
  return mockProducts;
};

const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to local storage', e);
  }
};

/**
 * Service to manage products in Merry Crochet store.
 * 
 * TODO: FIREBASE FIRESTORE INTEGRATION
 * In Stage 2, replace this mock implementation with Firestore queries:
 * - collection(db, "products")
 * - getDocs(), getDoc(), addDoc(), updateDoc(), deleteDoc()
 * 
 * TODO: FIREBASE STORAGE INTEGRATION
 * For image uploads, use Firebase Storage ref and uploadBytesResumable():
 * - uploadBytesResumable(ref(storage, `products/${filename}`), file)
 * - getDownloadURL() to retrieve public image URL before saving to Firestore.
 */
export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    // TODO: FIRESTORE - Query products collection: getDocs(collection(db, "products"))
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredProducts());
      }, 300);
    });
  },

  getProductById: async (id: string): Promise<Product | null> => {
    // TODO: FIRESTORE - Fetch single product: getDoc(doc(db, "products", id))
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = getStoredProducts();
        const found = products.find((p) => p.id === id) || null;
        resolve(found);
      }, 200);
    });
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    // TODO: FIRESTORE - Add document: addDoc(collection(db, "products"), { ...productData, createdAt: serverTimestamp() })
    // TODO: FIREBASE STORAGE - Upload file to storage before creating doc if an image file is supplied.
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const current = getStoredProducts();
        const updated = [newProduct, ...current];
        saveStoredProducts(updated);
        resolve(newProduct);
      }, 400);
    });
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    // TODO: FIRESTORE - Update document: updateDoc(doc(db, "products", id), productData)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = getStoredProducts();
        const index = current.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error("Product not found"));
          return;
        }
        const updatedProduct = { ...current[index], ...productData };
        current[index] = updatedProduct;
        saveStoredProducts(current);
        resolve(updatedProduct);
      }, 400);
    });
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    // TODO: FIRESTORE - Delete document: deleteDoc(doc(db, "products", id))
    // TODO: FIRESTORE SECURITY RULES - Only authenticated admin users can delete products!
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getStoredProducts();
        const filtered = current.filter((p) => p.id !== id);
        saveStoredProducts(filtered);
        resolve(true);
      }, 300);
    });
  }
};
