export type OrderStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

export type Order = {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
