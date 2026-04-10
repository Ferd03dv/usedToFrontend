export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface UserPublicProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_tutor: boolean;
  created_at: string;
  bio?: string;
  roles?: string[];
  average_rating?: number;
  total_lessons?: number;
}
