import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '../services/marketplace.service';
import { CreateBookPayload, CreateNotePayload, CreateBookRequestPayload } from '../types/marketplace';

// ---- BOOKS ----
export const useBooks = (filters?: Record<string, any>, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => marketplaceService.getBooks(filters),
    enabled,
  });
};

export const useBookDetails = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => marketplaceService.getBookById(id),
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookPayload) => marketplaceService.createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useMyListings = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['myListings', filters],
    queryFn: () => marketplaceService.getMyListings(filters),
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useHideListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.hideListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUnhideListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.unhideListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

// ---- NOTES ----
export const useNotes = (filters?: Record<string, any>, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['notes', filters],
    queryFn: () => marketplaceService.getNotes(filters),
    enabled,
  });
};

export const useNoteDetails = (id: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => marketplaceService.getNoteById(id),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotePayload) => marketplaceService.createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

// ---- FAVORITES ----
export const useFavorites = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => marketplaceService.getFavorites(params),
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { book_id?: string; note_id?: string }) => marketplaceService.toggleFavorite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// ---- BOOK REQUESTS (TROVA LIBRO) ----
export const useMyBookRequests = () => {
  return useQuery({
    queryKey: ['bookRequests', 'me'],
    queryFn: () => marketplaceService.getMyBookRequests(),
  });
};

export const useCreateBookRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookRequestPayload) => marketplaceService.createBookRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookRequests'] });
    },
  });
};

export const useCancelBookRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.cancelBookRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookRequests'] });
    },
  });
};

// ---- UPLOADS ----
export const useUploadFiles = () => {
  return useMutation({
    mutationFn: ({
      files,
      options,
    }: {
      files: File[];
      options?: { entityType?: 'book' | 'note'; entityId?: string };
    }) => marketplaceService.uploadFiles(files, options),
  });
};
