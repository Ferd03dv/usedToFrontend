import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookDetails, useNoteDetails, useFavorites, useToggleFavorite, useRemoveFavorite } from '../hooks/useMarketplace';
import { 
  ArrowLeft, 
  Book, 
  FileText, 
  Calendar, 
  Layers, 
  User, 
  Building2, 
  Hash,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ListingActions } from '../components/marketplace/ListingActions';
import { getImageUrl } from '../lib/imageUrl';

export const ListingDetails: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const isBook = type === 'book';
  const { data: bookResp, isLoading: isLoadingBook, isError: isErrorBook } = useBookDetails(isBook ? id! : '');
  const { data: noteResp, isLoading: isLoadingNote, isError: isErrorNote } = useNoteDetails(!isBook ? id! : '');
  const { data: rawFavData } = useFavorites();

  const isLoading = isBook ? isLoadingBook : isLoadingNote;
  const isError = isBook ? isErrorBook : isErrorNote;
  const item = isBook ? bookResp?.data : noteResp?.data;

  const favItems = useMemo(() => {
    const raw = rawFavData?.data;
    return Array.isArray(raw) ? raw : (raw as any)?.items || [];
  }, [rawFavData]);

  const favoriteItem = useMemo(() => {
    if (!item) return null;
    return favItems.find((f: any) => 
      (isBook && f.book_id === item.id) || 
      (!isBook && f.note_id === item.id)
    );
  }, [favItems, item, isBook]);

  const isFavorited = !!favoriteItem;

  const { mutate: addFavorite } = useToggleFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const handleToggleFavorite = () => {
    if (!item) return;
    if (favoriteItem) {
      removeFavorite(favoriteItem.id);
    } else {
      if (isBook) addFavorite({ book_id: item.id });
      else addFavorite({ note_id: item.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-gray-400 font-medium">Caricamento dettagli annuncio...</p>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl inline-flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12" />
          <h2 className="text-xl font-bold">Annuncio non trovato</h2>
          <p className="text-red-400/80">L'annuncio che stai cercando potrebbe essere stato rimosso o non è più disponibile.</p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Torna al Marketplace
          </button>
        </div>
      </div>
    );
  }

  const images: string[] = isBook ? (item as any).image_paths : (item as any).image_preview_paths;
  const mainImage = getImageUrl(
    images && images.length > 0 ? images[0] : null,
    'https://placehold.co/800x800/1f2937/94a3b8?text=Nessuna+Immagine'
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Torna ai risultati</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Media */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl aspect-square relative group">
            <img 
              src={mainImage} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg ${
                isBook ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isBook ? 'Libro' : 'Appunto'}
              </span>
            </div>
          </div>
          
          {/* Gallery placeholder if more images exist */}
          {images && images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <div key={idx} className="aspect-square bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-violet-500 transition-colors">
                  <img src={getImageUrl(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover opacity-60 hover:opacity-100" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {item.title}
            </h1>
            <div className="text-3xl font-black text-violet-400">
              €{item.price.toFixed(2)}
            </div>
          </div>

          <div className="space-y-8 flex-grow">
            {/* Main Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                <div className="flex items-center gap-2 mb-1 text-gray-500">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Categoria</span>
                </div>
                <div className="text-gray-100 font-semibold">{(item as any).category || (item as any).academic_level}</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                <div className="flex items-center gap-2 mb-1 text-gray-500">
                  {isBook ? <Book className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-wider">{isBook ? 'Condizione' : 'Anno'}</span>
                </div>
                <div className="text-gray-100 font-semibold">{(item as any).condition || (item as any).creation_year}</div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 space-y-4">
              <h3 className="text-white font-bold mb-4">Dettagli Specifici</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-violet-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Materia</div>
                    <div className="text-sm text-gray-100 font-medium">{item.subject}</div>
                  </div>
                </div>

                {isBook && (item as any).author && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-blue-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Autore</div>
                      <div className="text-sm text-gray-100 font-medium">{(item as any).author}</div>
                    </div>
                  </div>
                )}

                {isBook && (item as any).publisher && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-orange-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Editore</div>
                      <div className="text-sm text-gray-100 font-medium">{(item as any).publisher}</div>
                    </div>
                  </div>
                )}

                {isBook && (item as any).isbn && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">ISBN</div>
                      <div className="text-sm text-gray-100 font-medium">{(item as any).isbn}</div>
                    </div>
                  </div>
                )}

                {!isBook && (
                   <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Pagine</div>
                      <div className="text-sm text-gray-100 font-medium">{(item as any).pages_count}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-white font-bold mb-3">Descrizione</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                {item.description || "Nessuna descrizione fornita per questo annuncio."}
              </p>
            </div>
          </div>

          {/* Actions Component */}
          <ListingActions 
            listingId={item.id}
            sellerId={isBook ? (item as any).seller_id : (item as any).uploader_id}
            type={isBook ? 'book' : 'note'}
            price={item.price}
            isFavorite={isFavorited}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};
