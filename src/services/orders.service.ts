import { mockOrders } from '../data/mockOrders';
import type { Order, OrderStatus } from '../types/order';

const STORAGE_KEY = 'merry_crochet_mock_orders';

const getStoredOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading orders from localStorage', e);
  }
  return mockOrders;
};

const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage', e);
  }
};

/**
 * Service layer for Order management in Merry Crochet.
 * 
 * TODO: FIREBASE FIRESTORE INTEGRATION
 * Collection: "orders"
 * Replace mock implementations with Firestore SDK methods:
 * - addDoc(collection(db, "orders"), orderPayload)
 * - query(collection(db, "orders"), orderBy("createdAt", "desc"))
 * - updateDoc(doc(db, "orders", id), { status })
 * 
 * TODO: FIRESTORE SECURITY RULES
 * Customers can create orders via guest checkout (write-only).
 * Only authenticated admin users can read orders, query customer details, or update order statuses.
 */
export const ordersService = {
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; orderId: string; order: Order }> => {
    // TODO: FIRESTORE - Replace with addDoc(collection(db, "orders"), { ...orderData, status: "pending", createdAt: serverTimestamp() })
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        const current = getStoredOrders();
        saveStoredOrders([newOrder, ...current]);

        console.log("MOCK ORDER CREATED:", newOrder);

        resolve({
          success: true,
          orderId,
          order: newOrder
        });
      }, 500);
    });
  },

  getOrders: async (): Promise<Order[]> => {
    // TODO: FIRESTORE - Replace with getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")))
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredOrders());
      }, 300);
    });
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    // TODO: FIRESTORE - Replace doc fetch getDoc(doc(db, "orders", id))
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getStoredOrders();
        const found = orders.find((o) => o.id === id) || null;
        resolve(found);
      }, 200);
    });
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    // TODO: FIRESTORE - Replace with updateDoc(doc(db, "orders", id), { status })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const current = getStoredOrders();
        const index = current.findIndex((o) => o.id === id);
        if (index === -1) {
          reject(new Error("Order not found"));
          return;
        }
        current[index].status = status;
        saveStoredOrders(current);
        resolve(current[index]);
      }, 300);
    });
  }
};
