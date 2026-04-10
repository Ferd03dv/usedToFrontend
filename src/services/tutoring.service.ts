import { api } from '../lib/axios';
import { TutorProfileData, TutoringParams, TutoringSession } from '../types/tutoring';
import { PaginatedResponse } from '../types/marketplace';

export const tutoringService = {
  getTutors: async (params: TutoringParams): Promise<{ success: boolean; data: TutorProfileData[] }> => {
    const { data } = await api.get('/api/v1/tutoring/tutors', { params });
    return data;
  },

  getTutorById: async (id: string): Promise<{ success: boolean; data: TutorProfileData }> => {
    const { data } = await api.get(`/api/v1/tutoring/tutors/${id}`);
    return data;
  },

  getMyTutorProfile: async (): Promise<{ success: boolean; data: TutorProfileData }> => {
    const { data } = await api.get('/api/v1/tutoring/tutors/me');
    return data;
  },

  updateMyTutorProfile: async (payload: Partial<TutorProfileData>): Promise<{ success: boolean; data: TutorProfileData }> => {
    const { data } = await api.patch('/api/v1/tutoring/tutors/me', payload);
    return data;
  },

  getMyTutorSessions: async (params?: Record<string, any>): Promise<PaginatedResponse<TutoringSession>> => {
    const { data } = await api.get('/api/v1/tutoring/sessions/my/tutor', { params });
    return data;
  },

  confirmSession: async (sessionId: string): Promise<{ success: boolean; data: TutoringSession }> => {
    const { data } = await api.patch(`/api/v1/tutoring/sessions/${sessionId}/confirm`);
    return data;
  },

  cancelSession: async (sessionId: string): Promise<{ success: boolean; data: TutoringSession }> => {
    const { data } = await api.patch(`/api/v1/tutoring/sessions/${sessionId}/cancel`);
    return data;
  },

  completeSession: async (sessionId: string): Promise<{ success: boolean; data: TutoringSession }> => {
    const { data } = await api.patch(`/api/v1/tutoring/sessions/${sessionId}/complete`);
    return data;
  }
};
