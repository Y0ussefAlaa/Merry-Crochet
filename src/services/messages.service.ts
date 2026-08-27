import { mockMessages } from '../data/mockMessages';
import type { ContactMessage } from '../types/message';

const STORAGE_KEY = 'merry_crochet_mock_messages';

const getStoredMessages = (): ContactMessage[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading messages from localStorage', e);
  }
  return mockMessages;
};

const saveStoredMessages = (messages: ContactMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving messages to localStorage', e);
  }
};

/**
 * Service to handle customer inquiry messages.
 * 
 * TODO: FIREBASE FIRESTORE INTEGRATION
 * Collection: "messages"
 * Replace mock implementations with Firestore methods:
 * - addDoc(collection(db, "messages"), { name, phone, message, createdAt: serverTimestamp() })
 * - getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")))
 * - deleteDoc(doc(db, "messages", id))
 */
export const messagesService = {
  getMessages: async (): Promise<ContactMessage[]> => {
    // TODO: FIRESTORE - Replace with getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")))
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredMessages());
      }, 300);
    });
  },

  createMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> => {
    // TODO: FIRESTORE - Replace with addDoc(collection(db, "messages"), { ...data, createdAt: serverTimestamp() })
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: ContactMessage = {
          ...data,
          id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        const current = getStoredMessages();
        const updated = [newMessage, ...current];
        saveStoredMessages(updated);
        resolve(newMessage);
      }, 400);
    });
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    // TODO: FIRESTORE - Replace with deleteDoc(doc(db, "messages", id))
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getStoredMessages();
        const filtered = current.filter((m) => m.id !== id);
        saveStoredMessages(filtered);
        resolve(true);
      }, 300);
    });
  }
};
