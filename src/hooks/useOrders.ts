import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/orders.service';
import type { Order, OrderStatus } from '../types/order';

export const ORDERS_QUERY_KEY = ['orders'];

export const useOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => ordersService.getOrders(),
  });
};

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => (id ? ordersService.getOrderById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Order, 'id' | 'createdAt' | 'status'>) =>
      ordersService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
};
