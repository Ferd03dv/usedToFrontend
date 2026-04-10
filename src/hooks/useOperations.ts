import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsService } from '../services/operations.service';
import { useAuthStore } from '../store/useAuthStore';

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platformStats'],
    queryFn: () => operationsService.getPlatformStats(),
  });
};

export const useInbox = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => operationsService.getInbox(),
    enabled: !!isAuthenticated,
    refetchInterval: 30000,
  });
};

export const useChat = (userId: string | null) => {
  return useQuery({
    queryKey: ['chat', userId],
    queryFn: async () => {
      if (!userId) return Promise.reject('No user ID');
      try {
        return await operationsService.getChat(userId);
      } catch (err: any) {
        // 404 significa nessun messaggio ancora con questo utente (nuova conversazione)
        if (err?.response?.status === 404) {
          return { success: true, data: [] };
        }
        throw err;
      }
    },
    enabled: !!userId,
    retry: (failureCount, err: any) => {
      // Non riprovare su 404
      if (err?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};


export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, content }: { userId: string; content: string }) => 
      operationsService.sendMessage(userId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
};

export const useBuyBook = () => {
  return useMutation({
    mutationFn: (bookId: string) => operationsService.buyBook(bookId),
  });
};

export const useBuyNote = () => {
  return useMutation({
    mutationFn: (noteId: string) => operationsService.buyNote(noteId),
  });
};

export const useReportBug = () => {
  return useMutation({
    mutationFn: (payload: { title: string; description: string; device_info?: string }) => 
      operationsService.reportBug(payload),
  });
};