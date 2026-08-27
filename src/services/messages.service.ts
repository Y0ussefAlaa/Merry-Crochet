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

const formatMessageDoc = (docSnap: { id: string; data: () => any }): ContactMessage => {
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
    phone: data.phone || '',
    message: data.message || '',
    read: Boolean(data.read),
    createdAt: createdAtStr,
  };
};

export const messagesService = {
  getMessages: async (): Promise<ContactMessage[]> => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => formatMessageDoc(docSnap));
    } catch (error) {
      console.error("Error fetching messages from Firestore:", error);
      try {
        const snapshot = await getDocs(collection(db, "messages"));
        const messages = snapshot.docs.map((docSnap) => formatMessageDoc(docSnap));
        return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (fallbackError) {
        console.error("Fallback messages fetch failed:", fallbackError);
        throw error;
      }
    }
  },

  createMessage: async (
    data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>
  ): Promise<ContactMessage> => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        message: data.message,
        read: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "messages"), payload);
      return {
        ...data,
        id: docRef.id,
        read: false,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating contact message in Firestore:", error);
      throw error;
    }
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, "messages", id));
      return true;
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }
};
