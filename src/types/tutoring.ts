export interface TutorProfileData {
  id: string; // user ID
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
  // Assumed extended user fields for UI
  user?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface TutoringParams {
  page?: number;
  limit?: number;
  subject?: string;
  language?: string;
  min_rate?: number;
  max_rate?: number;
  min_rating?: number;
  only_online?: boolean;
  city?: string;
  profession?: string;
}

export interface TutoringSession {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meeting_link?: string | null;
  notes?: string | null;
  price: number;
  // Assumed extended fields for UI
  student?: {
    first_name: string;
    last_name: string;
  };
}
