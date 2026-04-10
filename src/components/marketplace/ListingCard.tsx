import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BookListing, StudyNote } from '../../types/marketplace';
import { useToggleFavorite, useRemoveFavorite } from '../../hooks/useMarketplace';
import { ListingActions } from './ListingActions';
import { getImageUrl } from '../../lib/imageUrl';

interface ListingCardProps {
  item: BookListing | StudyNote;
  type: 'book' | 'note';
  favoriteId?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, type, favoriteId }) => {
  const navigate = useNavigate();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const isFavorite = !!favoriteId;

  const images = type === 'book' ? (item as BookListing).image_paths : (item as StudyNote).image_preview_paths;
  const imageUrl = getImageUrl(
    images && images.length > 0 ? images[0] : null,
    'https://placehold.co/400x400/e2e8f0/64748b?text=Nessuna+Immagine'
  );

  const badgeText = type === 'book' ? (item as BookListing).condition : (item as StudyNote).academic_level;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favoriteId) {
      removeFavorite(favoriteId);
    } else {
      if (type === 'book') {
        toggleFavorite({ book_id: item.id });
      } else {
        toggleFavorite({ note_id: item.id });
      }
    }
  };

  return (
    <div 
      onClick={() => navigate(`/marketplace/${type}/${item.id}`)}
      className="group bg-gray-800 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          onError={(e) => {
             e.currentTarget.src = 'https://placehold.co/400x400/1f2937/94a3b8?text=Nessuna+Immagine';
          }}
        />
        
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 
            ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-gray-900/60 text-gray-300 hover:bg-gray-900/90 hover:text-red-400'}`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold bg-gray-900/80 backdrop-blur-md text-gray-200 rounded-full shadow-sm border border-gray-700/50">
            {badgeText}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-white leading-tight line-clamp-2">{item.title}</h3>
          <span className="font-bold text-violet-400 whitespace-nowrap">€{item.price.toFixed(2)}</span>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-400 mb-4">
          <span className="truncate max-w-[150px]">
            {type === 'book' ? (item as BookListing).subject : (item as StudyNote).subject}
          </span>
          <span>{type === 'book' ? 'Libro' : 'Appunto'}</span>
        </div>

        {/* Azioni inserite come demo o parte estesa */}
        <div className="mt-auto border-t border-gray-700 pt-3" onClick={(e) => e.stopPropagation()}>
          <ListingActions 
            listingId={item.id} 
            sellerId={type === 'book' ? (item as BookListing).seller_id : (item as StudyNote).uploader_id} 
            type={type} 
            price={item.price} 
            isFavorite={isFavorite}
            onToggleFavorite={handleFavoriteClick}
          />
        </div>
      </div>
    </div>
  );
};
