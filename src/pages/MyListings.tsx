import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyListings, useDeleteListing, useHideListing, useUnhideListing } from '../hooks/useMarketplace';
import { Book, EyeOff, Eye, Trash2 } from 'lucide-react';
import { getImageUrl } from '../lib/imageUrl';

export const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useMyListings();
  const deleteMutation = useDeleteListing();
  const hideMutation = useHideListing();
  const unhideMutation = useUnhideListing();

  const responseData: any = response?.data;
  const listings: any[] = Array.isArray(responseData) 
    ? responseData 
    : (responseData?.data || responseData?.items || []);

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo annuncio? L'operazione non può essere annullata.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleHideToggle = (id: string, currentStatus: string) => {
    if (currentStatus === 'Active') {
      hideMutation.mutate(id);
    } else {
      unhideMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-600">
        Si è verificato un errore nel caricamento dei tuoi annunci. Riprova più tardi.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">I Miei Annunci</h1>
          <p className="text-gray-400 mt-2">Gestisci i libri e gli appunti che hai messo in vendita.</p>
        </div>
        <a
          href="/create-listing"
          className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          Nuovo Annuncio
        </a>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
          <Book className="mx-auto h-16 w-16 text-gray-600" />
          <h3 className="mt-4 text-xl font-bold text-white">Nessun annuncio trovato</h3>
          <p className="mt-2 text-gray-400">Non hai ancora pubblicato annunci per vendere i tuoi libri o appunti.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <div 
              key={listing.id} 
              onClick={() => navigate(`/marketplace/book/${listing.id}`)}
              className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-violet-500/50 transition-colors cursor-pointer"
            >
              <div className="h-28 w-24 flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                {listing.image_paths && listing.image_paths.length > 0 ? (
                  <img src={getImageUrl(listing.image_paths[0])} alt={listing.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-600">
                    <Book className="h-8 w-8" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{listing.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ml-4 whitespace-nowrap ${
                    listing.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    listing.status === 'Sold' ? 'bg-gray-700 text-gray-300 border border-gray-600' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {listing.status === 'Active' ? 'Attivo' : listing.status === 'Sold' ? 'Venduto' : 'Nascosto'}
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                  <div className="font-bold text-violet-400 text-lg">€{listing.price.toFixed(2)}</div>
                  <div className="hidden sm:block text-gray-600">•</div>
                  <div>Condizione: <span className="text-gray-300">{listing.condition}</span></div>
                  <div className="hidden sm:block text-gray-600">•</div>
                  <div>Editore: <span className="text-gray-300">{listing.publisher}</span></div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-3 w-full sm:w-32 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleHideToggle(listing.id, listing.status)}
                  disabled={hideMutation.isPending || unhideMutation.isPending}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  {listing.status === 'Active' ? (
                     <><EyeOff className="w-4 h-4" /> Nascondi</>
                  ) : (
                     <><Eye className="w-4 h-4" /> Mostra</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-500/20 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" /> Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
