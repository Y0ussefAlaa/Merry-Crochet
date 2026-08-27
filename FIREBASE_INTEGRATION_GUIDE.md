# 🧶 Merry Crochet — Firebase Backend Integration Guide (Stage 2)

This documentation is designed for the backend developer / teammate integrating **Firebase** into the **Merry Crochet** web application codebase.

The frontend is built with **Vite + React + TypeScript** using a clean, decoupled architecture. All UI components call custom hooks, which invoke modular service files. You only need to update the service files and Firebase configuration to replace mock data with live Firebase services!

---

## 📋 Table of Contents
1. [Firebase Setup & Environment Variables](#1-firebase-setup--environment-variables)
2. [Firebase Authentication](#2-firebase-authentication)
3. [Cloud Firestore Collections & Schemas](#3-cloud-firestore-collections--schemas)
4. [Firebase Storage (Product Image Uploads)](#4-firebase-storage-product-image-uploads)
5. [Firestore Security Rules](#5-firestore-security-rules)
6. [Service Layer Code Integration Guide](#6-service-layer-code-integration-guide)
7. [Testing Checklist](#7-testing-checklist)

---

## 1. Firebase Setup & Environment Variables

### Step 1: Install Firebase SDK
Run the following command in the project root:

```bash
yarn add firebase
# or
npm install firebase
```

### Step 2: Environment Variables
Create a `.env` file in the project root (and update `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Initialize Firebase App (`src/lib/firebase.ts`)
Replace `src/lib/firebase.ts` with the following:

```typescript
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 2. Firebase Authentication

Admin access is restricted to authenticated admin users. There is no public user registration page.

### Setup Steps:
1. Go to **Firebase Console** -> **Authentication** -> **Sign-in method**.
2. Enable **Email/Password**.
3. Manually create the Admin account (e.g. `admin@merrycrochet.com` with a secure password).

---

## 3. Cloud Firestore Collections & Schemas

Set up the following 3 Firestore collections:

### 📦 Collection 1: `products`
Stores store items displayed in the product catalog.

```typescript
// Firestore Document ID: Auto-generated string
interface ProductDoc {
  name: string;                // e.g. "Handmade Crochet Flower Bouquet"
  description: string;         // Detailed craft description
  price: number;               // Price in EGP (e.g. 450)
  image: string;               // Public Firebase Storage URL
  stock: number;               // Remaining units (e.g. 12)
  availability: "in-stock" | "low-stock" | "out-of-stock" | "made-to-order";
  createdAt: Timestamp;        // serverTimestamp()
}
```

---

### 🛒 Collection 2: `orders`
Stores customer guest orders created during checkout.

```typescript
// Firestore Document ID: Auto-generated string
interface OrderDoc {
  customer: {
    name: string;              // e.g. "Mariam El-Sayed"
    phone: string;             // Validated Egyptian phone number (e.g. "01001234567")
    address: string;           // Full delivery address
    notes?: string;            // Optional gift notes
  };
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;            // Subtotal in EGP
  deliveryFee: number;         // Delivery fee in EGP
  total: number;               // Total price in EGP
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Timestamp;        // serverTimestamp()
}
```

---

### 💬 Collection 3: `messages`
Stores customer inquiries submitted from the landing page **Contact Us** form.

```typescript
// Firestore Document ID: Auto-generated string
interface MessageDoc {
  name: string;                // Customer name
  phone: string;               // Validated Egyptian phone number
  message: string;             // Inquiry message body
  createdAt: Timestamp;        // serverTimestamp()
  read: boolean;               // default: false
}
```

---

## 4. Firebase Storage (Product Image Uploads)

Images uploaded when adding or editing products in the Admin portal must be stored in Firebase Storage under the `products/` folder.

- **Path Format**: `products/{timestamp}_{filename}`
- **Operations**: Upload `File` instance -> get download URL -> save URL string into the product's Firestore document.

---

## 5. Firestore Security Rules

Copy and paste these production-ready security rules into **Firebase Console -> Firestore Database -> Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAdmin() {
      return request.auth != null;
    }

    // 1. PRODUCTS COLLECTION
    match /products/{productId} {
      // Anyone can read products catalog
      allow read: if true;
      // Only authenticated admins can create, update, or delete products
      allow write: if isAdmin();
    }

    // 2. ORDERS COLLECTION
    match /orders/{orderId} {
      // Guest customers can submit orders
      allow create: if true;
      // Only authenticated admins can view customer details or update order status
      allow read, update, delete: if isAdmin();
    }

    // 3. MESSAGES COLLECTION
    match /messages/{messageId} {
      // Guest customers can submit contact messages
      allow create: if true;
      // Only authenticated admins can view or delete messages
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

## 6. Service Layer Code Integration Guide

To connect the frontend to live Firebase services, update the files in `src/services/`:

### A. Auth Service (`src/services/auth.service.ts`)

```typescript
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { AdminUser } from "../types/auth";

export const authService = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || "Admin",
    };
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: (): AdminUser | null => {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "Admin",
    };
  }
};
```

### B. Update AuthContext (`src/context/AuthContext.tsx`)
Subscribe to Firebase `onAuthStateChanged` listener:

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Admin',
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  });
  return () => unsubscribe();
}, []);
```

---

### C. Products Service (`src/services/products.service.ts`)

```typescript
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import type { Product } from "../types/product";

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    })) as Product[];
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const docSnap = await getDoc(doc(db, "products", id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    } as Product;
  },

  uploadImage: async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  createProduct: async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return {
      ...productData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, productData);
    const updatedSnap = await getDoc(productRef);
    return { id: updatedSnap.id, ...updatedSnap.data() } as Product;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await deleteDoc(doc(db, "products", id));
    return true;
  }
};
```

---

### D. Orders Service (`src/services/orders.service.ts`)

```typescript
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Order, OrderStatus } from "../types/order";

export const ordersService = {
  createOrder: async (orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return {
      success: true,
      orderId: docRef.id,
      order: {
        ...orderData,
        id: docRef.id,
        status: "pending" as OrderStatus,
        createdAt: new Date().toISOString(),
      },
    };
  },

  getOrders: async (): Promise<Order[]> => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    })) as Order[];
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const docSnap = await getDoc(doc(db, "orders", id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    } as Order;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status });
    const updatedSnap = await getDoc(orderRef);
    return { id: updatedSnap.id, ...updatedSnap.data() } as Order;
  }
};
```

---

### E. Messages Service (`src/services/messages.service.ts`)

```typescript
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { ContactMessage } from "../types/message";

export const messagesService = {
  getMessages: async (): Promise<ContactMessage[]> => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    })) as ContactMessage[];
  },

  createMessage: async (data: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> => {
    const docRef = await addDoc(collection(db, "messages"), {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    });
    return {
      ...data,
      id: docRef.id,
      read: false,
      createdAt: new Date().toISOString(),
    };
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    await deleteDoc(doc(db, "messages", id));
    return true;
  }
};
```

---

## 7. Testing Checklist

Before deploying to production, verify the following:

- [ ] `.env` keys populated and `.env` added to `.gitignore`.
- [ ] Admin login succeeds at `/admin/login` using Firebase Auth.
- [ ] Guest checkout creates a document in `orders` collection without requiring user login.
- [ ] Contact Us form creates a document in `messages` collection.
- [ ] Customer phone numbers match Egyptian format validation (`010...`, `011...`, `012...`, `015...`, `+20...`).
- [ ] Product creation uploads image to Firebase Storage and writes download URL to Firestore `products` collection.
- [ ] Unauthenticated users attempting to access `/admin/orders` or `/admin/messages` directly in Firestore are denied by Firestore Security Rules.
