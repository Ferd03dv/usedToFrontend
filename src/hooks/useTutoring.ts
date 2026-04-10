import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tutoringService } from '../services/tutoring.service';
import { TutoringParams } from '../types/tutoring';

export const useTutors = (params: TutoringParams) => {
  return useQuery({
    queryKey: ['tutors', params],
    queryFn: () => tutoringService.getTutors(params),
  });
};

export const useTutor = (id: string) => {
  return useQuery({
    queryKey: ['tutor', id],
    queryFn: () => tutoringService.getTutorById(id),
    enabled: !!id,
  });
};

export const useMyTutorProfile = () => {
  return useQuery({
    queryKey: ['tutorProfile', 'me'],
    queryFn: () => tutoringService.getMyTutorProfile(),
  });
};

export const useUpdateMyTutorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => tutoringService.updateMyTutorProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorProfile', 'me'] });
    },
  });
};

export const useMyTutorSessions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['tutorSessions', 'me', params],
    queryFn: () => tutoringService.getMyTutorSessions(params),
  });
};

export const useConfirmSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => tutoringService.confirmSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorSessions', 'me'] });
    },
  });
};

export const useCancelSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => tutoringService.cancelSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorSessions', 'me'] });
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => tutoringService.completeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorSessions', 'me'] });
    },
  });
};
