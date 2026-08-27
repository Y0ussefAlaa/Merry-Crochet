import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Handmade Crochet Flower Bouquet",
    description: "A everlasting bouquet featuring soft pastel roses, daisies, and lavender sprigs handcrafted with premium milk cotton yarn. Wrapped in textured craft paper with a silk ribbon bow.",
    price: 450,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80",
    category: "Bouquets",
    stock: 12,
    availability: "in-stock",
    createdAt: "2026-08-01T10:00:00Z"
  },
  {
    id: "prod-2",
    name: "Vintage Aesthetic Crochet Shoulder Bag",
    description: "Chic tote bag crafted from durable natural cotton yarn in a sun-burst granny square pattern. Features a comfortable wide strap and a magnetic interior clasp.",
    price: 680,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    category: "Bags",
    stock: 5,
    availability: "low-stock",
    createdAt: "2026-08-03T14:30:00Z"
  },
  {
    id: "prod-3",
    name: "Cozy Plush Teddy Bear (Amigurumi)",
    description: "An adorable soft teddy bear crocheted with plush chenille yarn. Stuffed with hypoallergenic fiberfill, safe for children and toddler nursery decor.",
    price: 380,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80",
    category: "Plushies & Toys",
    stock: 8,
    availability: "in-stock",
    createdAt: "2026-08-05T09:15:00Z"
  },
  {
    id: "prod-4",
    name: "Mini Crochet Strawberry Keychain",
    description: "Cute little strawberry charm with green leafy crown and sturdy brass key ring. Adds a sweet pop of color to your keys, backpack, or handbag.",
    price: 95,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
    category: "Keychains",
    stock: 25,
    availability: "in-stock",
    createdAt: "2026-08-10T11:20:00Z"
  },
  {
    id: "prod-5",
    name: "Crochet Sunflower Desk Bloom",
    description: "A bright, cheerful crochet sunflower set in a miniature terracotta pot. Requires zero watering and brings joy to your workspace or windowsill every day.",
    price: 220,
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    category: "Bouquets",
    stock: 15,
    availability: "in-stock",
    createdAt: "2026-08-12T16:00:00Z"
  },
  {
    id: "prod-6",
    name: "Pastel Sleepy Kitty Plushie",
    description: "Calming pastel sleepy cat with embroidered whiskers and delicate blush details. Perfect cuddle buddy or nursery accent item.",
    price: 320,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    category: "Plushies & Toys",
    stock: 3,
    availability: "low-stock",
    createdAt: "2026-08-14T18:45:00Z"
  },
  {
    id: "prod-7",
    name: "Boho Daisy Coaster Set (4-Piece)",
    description: "Set of 4 circular drink coasters in soft cream and sage with fringed edges. Highly absorbent, heat-resistant, and machine washable on gentle cycle.",
    price: 180,
    image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80",
    category: "Home & Coasters",
    stock: 0,
    availability: "made-to-order",
    createdAt: "2026-08-15T08:00:00Z"
  },
  {
    id: "prod-8",
    name: "Floral Crochet Bandana & Hair Clip Set",
    description: "Vintage retro triangle hair bandana with matching daisy snap clips. Breathable cotton weave suitable for sunny picnics and casual outings.",
    price: 240,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    stock: 10,
    availability: "in-stock",
    createdAt: "2026-08-18T12:10:00Z"
  },
  {
    id: "prod-9",
    name: "Handmade Baby Booties & Raspberry Rattle Set",
    description: "Gentle newborn baby set including soft booties with silk ties and an easy-grip wooden ring rattle with crocheted berries.",
    price: 520,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    category: "Baby Gifts",
    stock: 6,
    availability: "in-stock",
    createdAt: "2026-08-20T15:00:00Z"
  },
  {
    id: "prod-10",
    name: "Woven Pastel Crossbody Mini Pouch",
    description: "Compact phone and card purse in soft lavender and sage yarn. Features a magnetic metal closure and a sturdy braided strap.",
    price: 340,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    category: "Bags",
    stock: 0,
    availability: "out-of-stock",
    createdAt: "2026-08-22T10:20:00Z"
  },
  {
    id: "prod-11",
    name: "Amigurumi Bunny Keychain Pair",
    description: "Set of two matching bunny keychains (dusty rose & sage green) with soft pom-pom tails and heart key rings. Great for couples or best friends.",
    price: 160,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    category: "Keychains",
    stock: 14,
    availability: "in-stock",
    createdAt: "2026-08-24T14:00:00Z"
  },
  {
    id: "prod-12",
    name: "Handmade Crochet Coffee Sleeve",
    description: "Reusable cozy sleeve for your takeaway coffee cup or tumbler. Keeps your hands comfortable while reducing single-use paper cups.",
    price: 110,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    category: "Home & Coasters",
    stock: 20,
    availability: "in-stock",
    createdAt: "2026-08-25T11:00:00Z"
  }
];
