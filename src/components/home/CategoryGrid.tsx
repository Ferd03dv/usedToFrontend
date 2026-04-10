import React from 'react';
import { usePlatformStats } from '../../hooks/useOperations';
import { Loader2, AlertCircle, Library, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoryDescriptions } from '../../constants/categories';

export const CategoryGrid: React.FC = () => {
  const { data: response, isLoading, isError } = usePlatformStats();
  const navigate = useNavigate();

  const [infoCategory, setInfoCategory] = React.useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(category)}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" />
        <p className="text-gray-400">Caricamento categorie in corso...</p>
      </div>
    );
  }

  if (isError || !response?.data?.books_by_category) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-400">
        <AlertCircle className="w-8 h-8 md:w-10 md:h-10 mb-4 opacity-50" />
        <p>Impossibile caricare le categorie al momento.</p>
      </div>
    );
  }

  const { books_by_category } = response.data;

  // We can filter out empty categories or show all
  const categoriesEntries = Object.entries(books_by_category).filter(
    ([_, count]) => count > 0
  );

  if (categoriesEntries.length === 0) {
    return null; // Don't show the grid if no books are available
  }

  return (
    <div className="w-full w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Library className="w-6 h-6 text-violet-500" />
        Esplora per Categoria
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoriesEntries.map(([category, count]) => (
          <div
            key={category}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-violet-500 hover:bg-gray-750 transition-all group text-left relative overflow-hidden"
          >
            <div onClick={() => handleCategoryClick(category)} className="absolute inset-0 z-0 cursor-pointer" />

            <div className="flex flex-col gap-1 relative z-10 pointer-events-none">
              <span className="font-semibold text-gray-200 group-hover:text-white truncate pr-2">
                {category}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-gray-900 text-violet-400 text-xs font-bold rounded-full">
                  {count} testi
                </span>
              </div>
            </div>

            {categoryDescriptions[category] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoCategory(category);
                }}
                className="p-2 rounded-full bg-gray-900 border border-gray-700 text-gray-400 hover:text-violet-400 hover:border-violet-500/50 transition-all relative z-20 pointer-events-auto shadow-sm"
                title="Info categoria"
              >
                <Info className="w-4 h-4 md:w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Info Modal */}
      {infoCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 relative">
              <button
                onClick={() => setInfoCategory(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full transition-colors"
                title="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-violet-600/20 p-3 rounded-xl">
                  <Info className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{infoCategory}</h3>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">
                {categoryDescriptions[infoCategory]}
              </p>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    handleCategoryClick(infoCategory!);
                    setInfoCategory(null);
                  }}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  Esplora Categoria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
