export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_tutor: boolean;
  needs_tutor_profile_completion: boolean;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthResult {
  user: AuthUser;
  session: AuthSession;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_tutor: boolean;
  created_at: string;
  bio?: string;
  university?: string;
  degree_course?: string;
}

export interface TutorProfileData {
  id: string;
  bio: string;
  hourly_rate: number;
  subjects_taught: string[];
  languages: string[];
  is_active: boolean;
  total_lessons: number;
  average_rating: number;
  only_online?: boolean;
  city?: string;
  max_distance?: number;
  work?: string;
  profession?: 'docente' | 'libero professionista' | 'dipendente';
  degree?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterStep1Payload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  is_tutor: boolean;
}

export interface RegisterTutorStep2Payload {
  bio: string;
  hourly_rate: number;
  subjects_taught: string[];
  languages: string[];
  only_online?: boolean;
  city?: string;
  max_distance?: number;
  work?: string;
  profession?: 'docente' | 'libero professionista' | 'dipendente';
  degree?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
