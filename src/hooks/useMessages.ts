import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/messages.service';
import type { ContactMessage } from '../types/message';

export const MESSAGES_QUERY_KEY = ['messages'];

export const useMessages = () => {
  return useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => messagesService.getMessages(),
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) =>
      messagesService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
};
