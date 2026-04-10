import React from 'react';
import { useBuyBook, useBuyNote } from '../../hooks/useOperations';
import { MessageCircle, ShoppingBag, Loader2, AlertCircle, CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListingActionsProps {
  listingId: string;
  sellerId: string;
  type: 'book' | 'note';
  price: number;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const ListingActions: React.FC<ListingActionsProps> = ({ 
  listingId, 
  sellerId, 
  type,
  price,
  isFavorite,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  const buyBook = useBuyBook();
  const buyNote = useBuyNote();

  const isPending = buyBook.isPending || buyNote.isPending;
  const isError = buyBook.isError || buyNote.isError;
  const isSuccess = buyBook.isSuccess || buyNote.isSuccess;

  const handleChat = () => {
    // Redirige all'inbox selezionando l'utente (possibile implementazione via query param)
    navigate(`/inbox?user=${sellerId}`);
  };

  const handleBuy = () => {
    if (type === 'book') {
      buyBook.mutate(listingId);
    } else {
      buyNote.mutate(listingId);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      {/* Bottoni Primari */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleChat}
          disabled={isPending || isSuccess}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-5 h-5" />
          Chatta col venditore
        </button>

        <button
          onClick={handleBuy}
          disabled={isPending || isSuccess}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Elaborazione...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Acquistato!
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Acquista a €{price.toFixed(2)}
            </>
          )}
        </button>
      </div>

      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          {isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        </button>
      )}

      {/* Messaggi di feedback post transazione */}
      {isSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <p>Transazione completata con successo! Troverai i dettagli nel tuo profilo.</p>
        </div>
      )}

      {isError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>Ops! Si è verificato un errore durante l'acquisto. Riprova più tardi.</p>
        </div>
      )}
    </div>
  );
};
