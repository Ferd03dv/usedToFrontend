import { api } from '../lib/axios';
import { ApiResponse } from '../types/auth';
import { Notification } from '../types/models';

export const notificationService = {
  getUnread: async () => {
    const { data } = await api.get<ApiResponse<Notification[]>>('/notifications');
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch<ApiResponse<void>>('/notifications/read-all');
    return data;
  }
};
