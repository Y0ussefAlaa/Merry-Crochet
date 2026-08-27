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

const formatOrderDoc = (docSnap: { id: string; data: () => any }): Order => {
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
    customer: {
      name: data.customer?.name || '',
      phone: data.customer?.phone || '',
      address: data.customer?.address || '',
      notes: data.customer?.notes || '',
    },
    items: Array.isArray(data.items)
      ? data.items.map((item: any) => ({
          productId: item.productId || '',
          productName: item.productName || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || '',
        }))
      : [],
    subtotal: Number(data.subtotal) || 0,
    deliveryFee: Number(data.deliveryFee) || 0,
    total: Number(data.total) || 0,
    status: (data.status as OrderStatus) || 'pending',
    createdAt: createdAtStr,
  };
};

export const ordersService = {
  createOrder: async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; orderId: string; order: Order }> => {
    try {
      const payload = {
        customer: {
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          address: orderData.customer.address,
          notes: orderData.customer.notes || '',
        },
        items: orderData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || '',
        })),
        subtotal: Number(orderData.subtotal),
        deliveryFee: Number(orderData.deliveryFee),
        total: Number(orderData.total),
        status: 'pending' as OrderStatus,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), payload);
      const createdOrder: Order = {
        ...orderData,
        id: docRef.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        orderId: docRef.id,
        order: createdOrder,
      };
    } catch (error) {
      console.error('Error creating order in Firestore:', error);
      throw error;
    }
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => formatOrderDoc(docSnap));
    } catch (error) {
      console.error('Error fetching orders from Firestore:', error);
      try {
        const snapshot = await getDocs(collection(db, 'orders'));
        const orders = snapshot.docs.map((docSnap) => formatOrderDoc(docSnap));
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (fallbackError) {
        console.error('Fallback orders fetch failed:', fallbackError);
        throw error;
      }
    }
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const docSnap = await getDoc(doc(db, 'orders', id));
      if (!docSnap.exists()) return null;
      return formatOrderDoc(docSnap);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
      const updatedSnap = await getDoc(orderRef);
      if (!updatedSnap.exists()) {
        throw new Error('Order not found after update.');
      }
      return formatOrderDoc(updatedSnap);
    } catch (error) {
      console.error(`Error updating order status for ${id}:`, error);
      throw error;
    }
  },
};
