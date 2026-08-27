import type { ContactMessage } from '../types/message';

export const mockMessages: ContactMessage[] = [
  {
    id: "MSG-101",
    name: "Habiba Ahmed",
    phone: "01001234567",
    message: "Hi Merry Crochet! Can I order the flower bouquet with customized pink and lavender roses for my mother's birthday next Friday?",
    createdAt: "2026-08-27T12:30:00Z",
    read: false
  },
  {
    id: "MSG-102",
    name: "Omar Hassan",
    phone: "01229876543",
    message: "Hello, I wanted to ask if you offer bulk pricing for 15 mini crochet strawberry keychains as wedding giveaways?",
    createdAt: "2026-08-26T15:45:00Z",
    read: true
  },
  {
    id: "MSG-103",
    name: "Dina Mostafa",
    phone: "01115554321",
    message: "Good afternoon! Do you ship to Alexandria and how long does delivery take?",
    createdAt: "2026-08-25T11:10:00Z",
    read: true
  }
];
