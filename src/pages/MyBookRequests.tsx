import React, { useState } from 'react';
import { useMyBookRequests, useCancelBookRequest } from '../hooks/useMarketplace';
import { Book, Loader2, Trash2, Search, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBookRequests: React.FC = () => {
  const { data, isLoading, isError, error } = useMyBookRequests();
  const cancelRequest = useCancelBookRequest();

  // Normalizza risposta: potrebbe essere { data: [] } oppure { data: { items: [] } }
  const rawData = data?.data;
  const requests = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];

  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const handleCancelClick = (id: string) => {
    setRequestToDelete(id);
  };

  const confirmCancel = () => {
    if (requestToDelete) {
      cancelRequest.mutate(requestToDelete, {
        onSuccess: () => setRequestToDelete(null)
      });
    }
  };

  const closeModal = () => setRequestToDelete(null);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Book className="w-8 h-8 text-violet-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Le mie Richieste</h1>
            <p className="text-gray-400 mt-1">Gestisci i libri che stai cercando (Trova Libro).</p>
          </div>
        </div>
        <Link 
          to="/create-request"
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-md"
        >
          Nuova Richiesta
        </Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-10 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Errore nel caricamento</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Impossibile caricare le richieste. Verifica di essere connesso e riprova.
            </p>
            {(error as any)?.response?.status && (
              <p className="mt-2 text-xs text-red-400 font-mono">
                Errore {(error as any).response.status}: {(error as any).response?.data?.message || 'Errore sconosciuto'}
              </p>
            )}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requests.map((req: any) => (
              <div key={req.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-violet-500 transition-colors flex flex-col h-full shadow-sm">
                
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-xs font-bold bg-gray-900 border border-gray-700 text-gray-300 rounded uppercase tracking-wider">
                    {req.category}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wider ${req.status === 'Attiva' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                    {req.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{req.title || 'Titolo non specificato'}</h3>
                
                <div className="text-sm text-gray-400 flex flex-col gap-1 mb-4">
                  {req.author && <div><span className="text-gray-500">Autore:</span> {req.author}</div>}
                  {(req.subject_or_genre || req.subject) && <div><span className="text-gray-500">Materia/Genere:</span> <span className="text-gray-300">{req.subject_or_genre || req.subject}</span></div>}
                  {req.isbn && <div><span className="text-gray-500">ISBN:</span> {req.isbn}</div>}
                </div>
                
                {(req.min_price || req.max_price) && (
                  <div className="text-violet-400 font-bold text-lg mb-2">
                    {req.min_price ? `€${req.min_price.toFixed(2)}` : '€0.00'} - {req.max_price ? `€${req.max_price.toFixed(2)}` : 'Nessun limite'}
                  </div>
                )}
                
                {req.description && (
                  <p className="text-sm text-gray-400 italic mb-4 line-clamp-2 flex-grow">"{req.description}"</p>
                )}

                {!req.description && <div className="flex-grow"></div>}

                <div className="pt-4 mt-auto border-t border-gray-700">
                  <button 
                    onClick={() => handleCancelClick(req.id)}
                    disabled={req.status !== 'Attiva'}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-red-500/10 text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-500/50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Annulla richiesta"
                  >
                    <Trash2 className="w-4 h-4" /> Elimina Richiesta
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800 border border-gray-700 rounded-2xl shadow-sm text-center">
            <div className="p-4 bg-gray-900 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nessuna richiesta attiva</h3>
            <p className="text-gray-400 max-w-sm">
              Non hai ancora creato nessuna richiesta. Se cerchi un libro ma non lo trovi nel marketplace, puoi creare una richiesta e verrai notificato.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Elimina Richiesta</h3>
                <p className="text-gray-400 text-sm">
                  Sei sicuro di voler eliminare questa richiesta? L'operazione non può essere annullata.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelRequest.isPending}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  {cancelRequest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
