import { api } from '../lib/axios';
import {
  PlatformStats,
  ConversationSummary,
  Message,
  Transaction,
  BugReport
} from '../types/operations';

export const operationsService = {
  getPlatformStats: async (): Promise<{ success: boolean; data: PlatformStats }> => {
    const { data } = await api.get('/api/v1/stats');
    return data;
  },

  getInbox: async (): Promise<{ success: boolean; data: ConversationSummary[] }> => {
    const { data } = await api.get('/api/v1/messages');
    return data;
  },

  getChat: async (userId: string): Promise<{ success: boolean; data: Message[] }> => {
    const { data } = await api.get(`/api/v1/messages/${userId}`);
    return data;
  },

  sendMessage: async (userId: string, content: string): Promise<{ success: boolean; data: Message }> => {
    const { data } = await api.post(`/api/v1/messages`, { receiver_id: userId, content });
    return data;
  },

  buyBook: async (bookId: string): Promise<{ success: boolean; data: Transaction }> => {
    const { data } = await api.post('/api/v1/transactions/book', { book_id: bookId });
    return data;
  },

  buyNote: async (noteId: string): Promise<{ success: boolean; data: Transaction }> => {
    const { data } = await api.post('/api/v1/transactions/note', { note_id: noteId });
    return data;
  },

  reportBug: async (payload: { title: string; description: string; device_info?: string }): Promise<{ success: boolean; data: BugReport }> => {
    const { data } = await api.post('/api/v1/bugs', payload);
    return data;
  }
};