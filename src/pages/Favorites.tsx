import React, { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useMarketplace';
import { ListingCard } from '../components/marketplace/ListingCard';
import { Loader2, Star, AlertCircle } from 'lucide-react';
import { marketplaceService } from '../services/marketplace.service';

interface ResolvedFavorite {
  favId: string;
  book_id?: string | null;
  note_id?: string | null;
  item: any;
  type: 'book' | 'note';
}

export const Favorites: React.FC = () => {
  const { data, isLoading, isError, error } = useFavorites();
  const [resolvedFavs, setResolvedFavs] = useState<ResolvedFavorite[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  // L'API risponde con { success, data: [], meta: {} } — data è un array flat
  const rawData = data?.data;
  const favorites: any[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.items || [];

  // Risolve i dettagli di ogni libro/nota (l'API non popola le relazioni)
  useEffect(() => {
    if (!favorites.length) {
      setResolvedFavs([]);
      return;
    }

    setIsResolving(true);
    const promises = favorites.map(async (fav: any) => {
      try {
        if (fav.book_id) {
          // Se book è già presente nell'oggetto (API popola le relazioni)
          if (fav.book) return { favId: fav.id, book_id: fav.book_id, item: fav.book, type: 'book' as const };
          const res = await marketplaceService.getBookById(fav.book_id);
          return { favId: fav.id, book_id: fav.book_id, item: res.data, type: 'book' as const };
        } else if (fav.note_id) {
          if (fav.note) return { favId: fav.id, note_id: fav.note_id, item: fav.note, type: 'note' as const };
          const res = await marketplaceService.getNoteById(fav.note_id);
          return { favId: fav.id, note_id: fav.note_id, item: res.data, type: 'note' as const };
        }
        return null;
      } catch {
        return null; // Ignora errori su singoli item (es. libro eliminato)
      }
    });

    Promise.all(promises).then(results => {
      setResolvedFavs(results.filter(Boolean) as ResolvedFavorite[]);
      setIsResolving(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.length, data]);

  const isLoadingAll = isLoading || isResolving;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">I miei Preferiti</h1>
          <p className="text-gray-400 mt-1">Gli annunci che hai salvato per consultarli più tardi.</p>
        </div>
      </div>

      <div className="flex-1">
        {isLoadingAll ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            <p className="text-gray-400 font-medium">Caricamento preferiti...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-10 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Errore nel caricamento</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Non è stato possibile caricare i preferiti. Verifica di essere connesso e riprova.
            </p>
            {(error as any)?.response?.status && (
              <p className="mt-2 text-xs text-red-400 font-mono">
                Errore {(error as any).response.status}: {(error as any).response?.data?.message || 'Errore sconosciuto'}
              </p>
            )}
          </div>
        ) : resolvedFavs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resolvedFavs.map((fav) => (
              <ListingCard
                key={fav.favId}
                item={fav.item}
                type={fav.type}
                favoriteId={fav.favId}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800 border border-gray-700 rounded-2xl shadow-sm text-center">
            <div className="p-4 bg-gray-900 rounded-full mb-4">
              <Star className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nessun preferito</h3>
            <p className="text-gray-400 max-w-sm">
              Non hai ancora salvato alcun annuncio. Clicca sulla stellina negli annunci del marketplace per aggiungerli qui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
