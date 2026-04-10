import { api } from '../lib/axios';
import { ApiResponse, Profile } from '../types/auth';
import { Review, UserPublicProfile } from '../types/models';

export const userService = {
  updateMe: async (payload: Partial<Profile>) => {
    const { data } = await api.patch<ApiResponse<Profile>>('/users/me', payload);
    return data;
  },

  deleteMe: async () => {
    const { data } = await api.delete<ApiResponse<void>>('/users/me');
    return data;
  },

  getUser: async (id: string) => {
    const { data } = await api.get<ApiResponse<UserPublicProfile>>(`/users/${id}`);
    return data;
  },

  getUserReviews: async (id: string, page = 1) => {
    const { data } = await api.get<ApiResponse<Review[]>>(`/users/${id}/reviews`, {
      params: { page }
    });
    return data;
  },

  createReview: async (id: string, payload: { rating: number; comment?: string }) => {
    const { data } = await api.post<ApiResponse<void>>(`/users/${id}/reviews`, payload);
    return data;
  }
};
