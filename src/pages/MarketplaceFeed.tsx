import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBooks, useNotes, useFavorites } from '../hooks/useMarketplace';
import { ListingCard } from '../components/marketplace/ListingCard';
import { BookCondition } from '../types/marketplace';
import { Search, Filter, Loader2, Book, FileText, ChevronDown, X } from 'lucide-react';
import {
  narrativeCategories,
  logicCategories,
  otherCategories
} from '../constants/categories';

const InputField = ({ label, name, value, onChange, placeholder = "", type = "text" }: any) => (
  <div>
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white placeholder-gray-600 transition-all"
    />
  </div>
);

export const MarketplaceFeed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initGenre = searchParams.get('genre') || '';
  const initCat = searchParams.get('category') || '';
  const isAppunti = initCat === 'Appunti' || initGenre === 'Appunti';

  const [activeTab, setActiveTab] = useState<'books' | 'notes'>(isAppunti ? 'notes' : 'books');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const initialBookFilterValue = initCat || initGenre || '';
  const initialNoteFilterValue = (initCat && initCat !== 'Appunti') ? initCat : (initGenre !== 'Appunti' ? initGenre : '');

  const [bookFilters, setBookFilters] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    description: '',
    condition: '',
    min_price: '',
    max_price: '',
    category: initialBookFilterValue
  });

  const [noteFilters, setNoteFilters] = useState({
    title: '',
    description: '',
    pages_count: '',
    academic_level: initialNoteFilterValue,
    subject: '',
    creation_year: '',
    min_price: '',
    max_price: ''
  });

  const { data: rawFavData } = useFavorites();
  const favItems = useMemo(() => {
    const raw = rawFavData?.data;
    return Array.isArray(raw) ? raw : (raw as any)?.items || [];
  }, [rawFavData]);

  const getFavoriteId = (itemId: string, itemType: 'book' | 'note') => {
    const fav = favItems.find((f: any) => 
      (itemType === 'book' && f.book_id === itemId) || 
      (itemType === 'note' && f.note_id === itemId)
    );
    return fav?.id;
  };

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const genre = searchParams.get('genre') || '';
    const appunti = cat === 'Appunti' || genre === 'Appunti';
    if (appunti) {
      setActiveTab('notes');
    } else {
      setActiveTab('books');
    }
    const bookCat = cat || genre || '';
    const noteCat = (cat && cat !== 'Appunti') ? cat : (genre !== 'Appunti' ? genre : '');
    setBookFilters(prev => ({ ...prev, category: bookCat }));
    setNoteFilters(prev => ({ ...prev, academic_level: noteCat }));
  }, [searchParams]);

  const handleBookFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleNoteFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNoteFilters(prev => ({ ...prev, [name]: value }));
  };

  const cleanFilters = (filters: any) => {
    return Object.entries(filters).reduce((acc, [k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        acc[k] = v;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const hasActiveFilters = useMemo(() => {
    const filters = activeTab === 'books' ? bookFilters : noteFilters;
    return Object.values(filters).some(v => v !== '');
  }, [bookFilters, noteFilters, activeTab]);

  const currentBookFilters = useMemo(() => cleanFilters(bookFilters), [bookFilters]);
  const currentNoteFilters = useMemo(() => cleanFilters(noteFilters), [noteFilters]);

  const { data: booksData, isLoading: isLoadingBooks } = useBooks(currentBookFilters, activeTab === 'books');
  const { data: notesData, isLoading: isLoadingNotes } = useNotes(currentNoteFilters, activeTab === 'notes');

  const isLoading = activeTab === 'books' ? isLoadingBooks : isLoadingNotes;
  const rawBooks = booksData?.data;
  const rawNotes = notesData?.data;
  const bookItems = Array.isArray(rawBooks) ? rawBooks : (rawBooks as any)?.items || [];
  const noteItems = Array.isArray(rawNotes) ? rawNotes : (rawNotes as any)?.items || [];
  const currentItems = activeTab === 'books' ? bookItems : noteItems;

  // Pannello filtri (riusato sia su desktop che nel drawer mobile)
  const FilterPanel = () => (
    <div className="space-y-4">
      {activeTab === 'books' ? (
        <>
          <InputField label="Titolo" name="title" value={bookFilters.title} onChange={handleBookFilterChange} placeholder="Es. Analisi 1" />
          <InputField label="Autore" name="author" value={bookFilters.author} onChange={handleBookFilterChange} placeholder="Es. Mario Rossi" />
          <InputField label="Editore" name="publisher" value={bookFilters.publisher} onChange={handleBookFilterChange} placeholder="Es. Zanichelli" />
          <InputField label="ISBN" name="isbn" value={bookFilters.isbn} onChange={handleBookFilterChange} placeholder="Es. 978..." />
          <InputField label="Descrizione" name="description" value={bookFilters.description} onChange={handleBookFilterChange} placeholder="Parole chiave..." />

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Genere / Categoria</label>
            <select
              name="category"
              value={bookFilters.category}
              onChange={handleBookFilterChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm outline-none focus:border-violet-500 text-white"
            >
              <option value="">Tutti i generi</option>
              <optgroup label="Narrativa & Letteratura">
                {narrativeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </optgroup>
              <optgroup label="Saggistica, Business & Crescita">
                {logicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </optgroup>
              <optgroup label="Fumetti, Arti & Passioni">
                {otherCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Condizione</label>
            <select
              name="condition"
              value={bookFilters.condition}
              onChange={handleBookFilterChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm outline-none focus:border-violet-500 text-white"
            >
              <option value="">Tutte le condizioni</option>
              {Object.values(BookCondition).map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Prezzo (€)</label>
            <div className="flex items-center gap-2">
              <input type="number" name="min_price" value={bookFilters.min_price} onChange={handleBookFilterChange} placeholder="Min" className="w-1/2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white" min={0} />
              <span className="text-gray-500">-</span>
              <input type="number" name="max_price" value={bookFilters.max_price} onChange={handleBookFilterChange} placeholder="Max" className="w-1/2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white" min={0} />
            </div>
          </div>
        </>
      ) : (
        <>
          <InputField label="Titolo" name="title" value={noteFilters.title} onChange={handleNoteFilterChange} placeholder="Titolo appunti" />
          <InputField label="Materia" name="subject" value={noteFilters.subject} onChange={handleNoteFilterChange} placeholder="Es. Diritto Privato" />
          <InputField label="Descrizione" name="description" value={noteFilters.description} onChange={handleNoteFilterChange} placeholder="Parole chiave..." />

          <div className="grid grid-cols-2 gap-3">
            <InputField label="N° Pagine" name="pages_count" type="number" value={noteFilters.pages_count} onChange={handleNoteFilterChange} placeholder="Es. 50" />
            <InputField label="Anno" name="creation_year" type="number" value={noteFilters.creation_year} onChange={handleNoteFilterChange} placeholder="Es. 2023" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Prezzo (€)</label>
            <div className="flex items-center gap-2">
              <input type="number" name="min_price" value={noteFilters.min_price} onChange={handleNoteFilterChange} placeholder="Min" className="w-1/2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white" min={0} />
              <span className="text-gray-500">-</span>
              <input type="number" name="max_price" value={noteFilters.max_price} onChange={handleNoteFilterChange} placeholder="Max" className="w-1/2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white" min={0} />
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:px-8 xl:px-12 min-h-[calc(100vh-4rem)]">

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{initGenre || initCat || 'Marketplace'}</h1>
          {!(initGenre || initCat) && <p className="text-gray-400 mt-1">Trova libri o appunti per i tuoi studi.</p>}
        </div>

        <div className="flex bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'books' ? 'bg-gray-700 text-violet-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Book className="w-4 h-4" /> Libri
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'notes' ? 'bg-gray-700 text-violet-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <FileText className="w-4 h-4" /> Appunti
          </button>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
            isFilterOpen
              ? 'bg-gray-800 border-violet-500/50 text-white'
              : hasActiveFilters
              ? 'bg-violet-600/10 border-violet-500/30 text-violet-300'
              : 'bg-gray-800 border-gray-700 text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-violet-400" />
            <span className="font-semibold text-sm">
              Filtri {activeTab === 'books' ? 'Libri' : 'Appunti'}
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold">
                ✓
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Mobile Filter Dropdown */}
        {isFilterOpen && (
          <div className="mt-2 bg-gray-800 border border-gray-700 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-violet-400" />
                <h3 className="font-bold text-white">Filtri {activeTab === 'books' ? 'Libri' : 'Appunti'}</h3>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-4 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Applica Filtri
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filtri Desktop */}
        <aside className="hidden lg:block w-80 flex-shrink-0 space-y-6">
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
              <Filter className="h-5 w-5 text-violet-400" />
              <h3 className="font-bold text-white text-lg">Filtri {activeTab === 'books' ? 'Libri' : 'Appunti'}</h3>
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Griglia Principale */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
              <p className="text-gray-400 font-medium">Caricamento annunci in corso...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentItems.map((item: any) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  type={activeTab === 'books' ? 'book' : 'note'}
                  favoriteId={getFavoriteId(item.id, activeTab === 'books' ? 'book' : 'note')}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-800 border border-gray-700 rounded-2xl shadow-sm text-center">
              <div className="p-4 bg-gray-900 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nessun risultato trovato</h3>
              <p className="text-gray-400 max-w-sm mb-6">Prova a modificare i filtri di ricerca o cambia categoria per trovare quello che cerchi.</p>

              <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-xl mt-4 w-full max-w-md">
                <h4 className="text-md font-semibold text-white mb-2">Non hai trovato quello che cerchi?</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Crea una richiesta "Trova Libro" e ricevi notifiche quando qualcuno caricherà un annuncio corrispondente.
                </p>
                <Link
                  to="/create-request"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors w-full"
                >
                  <Book className="w-5 h-5" />
                  Crea una Richiesta
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
