export type ProductAvailability =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "made-to-order";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock: number;
  availability: ProductAvailability;
  createdAt: string;
};
