import { api } from '../lib/axios';
import {
  PaginatedResponse,
  BookListing,
  StudyNote,
  CreateBookPayload,
  CreateNotePayload,
  Favorite,
  BookRequest,
  CreateBookRequestPayload
} from '../types/marketplace';

export const marketplaceService = {
  // Books (Annunci Libri)
  getBooks: async (params?: Record<string, any>): Promise<PaginatedResponse<BookListing>> => {
    const { data } = await api.get('/api/v1/books', { params });
    return data;
  },

  getBookById: async (id: string): Promise<{ success: boolean; data: BookListing }> => {
    const { data } = await api.get(`/api/v1/books/${id}`);
    return data;
  },

  createBook: async (payload: CreateBookPayload): Promise<{ success: boolean; data: BookListing }> => {
    const { data } = await api.post('/api/v1/books', payload);
    return data;
  },

  getMyListings: async (params?: Record<string, any>): Promise<PaginatedResponse<BookListing>> => {
    const { data } = await api.get('/api/v1/books/my-listings', { params });
    return data;
  },

  deleteListing: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/api/v1/books/${id}`);
    return data;
  },

  hideListing: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/api/v1/books/${id}/hide`);
    return data;
  },

  unhideListing: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/api/v1/books/${id}/unhide`);
    return data;
  },

  // Notes (Appunti)
  getNotes: async (params?: Record<string, any>): Promise<PaginatedResponse<StudyNote>> => {
    const { data } = await api.get('/api/v1/notes', { params });
    return data;
  },

  createNote: async (payload: CreateNotePayload): Promise<{ success: boolean; data: StudyNote }> => {
    const { data } = await api.post('/api/v1/notes', payload);
    return data;
  },

  getNoteById: async (id: string): Promise<{ success: boolean; data: StudyNote }> => {
    const { data } = await api.get(`/api/v1/notes/${id}`);
    return data;
  },

  // Favorites
  getFavorites: async (params?: Record<string, any>): Promise<PaginatedResponse<Favorite>> => {
    const { data } = await api.get('/api/v1/favorites', { params });
    return data;
  },

  toggleFavorite: async (payload: { book_id?: string; note_id?: string }): Promise<any> => {
    const { data } = await api.post('/api/v1/favorites', payload);
    return data;
  },

  removeFavorite: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/api/v1/favorites/${id}`);
    return data;
  },

  // Uploads
  uploadFiles: async (
    files: File[],
    options?: { entityType?: 'book' | 'note'; entityId?: string }
  ): Promise<{ success: boolean; data: { file_paths: string[]; entity_updated?: boolean } }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    // Passa entity come query params (sempre disponibili prima del parsing multipart)
    const params: Record<string, string> = {};
    if (options?.entityType) params['entity_type'] = options.entityType;
    if (options?.entityId) params['entity_id'] = options.entityId;

    const { data } = await api.post('/api/v1/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params,
    });
    return data;
  },
  // Book Requests (Trova Libro)
  getMyBookRequests: async (): Promise<{ success: boolean; data: BookRequest[] }> => {
    const { data } = await api.get('/api/v1/requests/me');
    return data;
  },

  createBookRequest: async (payload: CreateBookRequestPayload): Promise<{ success: boolean; data: BookRequest }> => {
    const { data } = await api.post('/api/v1/requests', payload);
    return data;
  },

  cancelBookRequest: async (id: string): Promise<{ success: boolean; data: BookRequest }> => {
    const { data } = await api.delete(`/api/v1/requests/${id}`);
    return data;
  },
};
