export interface PlatformStats {
  total_books: number;
  total_notes: number;
  total_tutors: number;
  books_by_category: Record<string, number>;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface ConversationSummary {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  last_message: string | {
    content: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  buyer_id: string;
  seller_id: string;
  book_id?: string;
  note_id?: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  device_info?: string;
  status: string;
  created_at: string;
}
