import { api } from '../lib/axios';
import {
  LoginPayload,
  RegisterStep1Payload,
  RegisterTutorStep2Payload,
  ApiResponse,
  AuthResult,
  Profile
} from '../types/auth';

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthResult>>('/api/v1/auth/login', payload);
    return data;
  },

  registerStep1: async (payload: RegisterStep1Payload) => {
    const { data } = await api.post<ApiResponse<AuthResult>>('/api/v1/auth/register/step-1', payload);
    return data;
  },

  registerTutorStep2: async (payload: RegisterTutorStep2Payload) => {
    const { data } = await api.post<ApiResponse<void>>('/api/v1/auth/register/tutor-step-2', payload);
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<Profile>>('/api/v1/users/me');
    return data;
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse<void>>('/api/v1/auth/logout');
    return data;
  },

  resetPassword: async (payload: { email: string }) => {
    const { data } = await api.post<ApiResponse<void>>('/api/v1/auth/reset-password', payload);
    return data;
  }
};
