import type { Order } from '../types/order';

export const mockOrders: Order[] = [
  {
    id: "ORD-9821",
    customer: {
      name: "Mariam El-Sayed",
      phone: "+201001234567",
      address: "14 Degla Street, Maadi, Cairo",
      notes: "Please deliver between 4 PM and 8 PM."
    },
    items: [
      {
        productId: "prod-1",
        productName: "Handmade Crochet Flower Bouquet",
        price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
      },
      {
        productId: "prod-4",
        productName: "Mini Crochet Strawberry Keychain",
        price: 95,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 640,
    deliveryFee: 50,
    total: 690,
    status: "pending",
    createdAt: "2026-08-27T10:15:00Z"
  },
  {
    id: "ORD-9820",
    customer: {
      name: "Hassan Hassan",
      phone: "+201229876543",
      address: "Bldg 45, 9th District, Sheikh Zayed, Giza",
      notes: "Gift packaging preferred."
    },
    items: [
      {
        productId: "prod-2",
        productName: "Vintage Aesthetic Crochet Shoulder Bag",
        price: 680,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 680,
    deliveryFee: 50,
    total: 730,
    status: "confirmed",
    createdAt: "2026-08-26T16:40:00Z"
  },
  {
    id: "ORD-9819",
    customer: {
      name: "Nouran Mahmoud",
      phone: "+201115554321",
      address: "Villa 12, Mirage City, New Cairo",
    },
    items: [
      {
        productId: "prod-3",
        productName: "Cozy Plush Teddy Bear (Amigurumi)",
        price: 380,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80"
      },
      {
        productId: "prod-9",
        productName: "Handmade Baby Booties & Raspberry Rattle Set",
        price: 520,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 900,
    deliveryFee: 50,
    total: 950,
    status: "confirmed",
    createdAt: "2026-08-25T11:20:00Z"
  },
  {
    id: "ORD-9818",
    customer: {
      name: "Salma Kamal",
      phone: "+201064443322",
      address: "22 Stanley Street, Alexandria",
    },
    items: [
      {
        productId: "prod-5",
        productName: "Crochet Sunflower Desk Bloom",
        price: 220,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 440,
    deliveryFee: 60,
    total: 500,
    status: "pending",
    createdAt: "2026-08-24T09:00:00Z"
  },
  {
    id: "ORD-9817",
    customer: {
      name: "Youssef Ibrahim",
      phone: "+201550001122",
      address: "8 Abbas El-Akkad, Nasr City, Cairo",
    },
    items: [
      {
        productId: "prod-7",
        productName: "Boho Daisy Coaster Set (4-Piece)",
        price: 180,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 180,
    deliveryFee: 50,
    total: 230,
    status: "cancelled",
    createdAt: "2026-08-22T14:10:00Z"
  }
];
