import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStats } from '../hooks/useOperations';
import { BookOpen, Users, FileText, Info, X } from 'lucide-react';

const scholasticCategories = [
  'Scuole Superiori',
  'Università',
  'Concorsi',
  'Appunti'
];

import {
  narrativeCategories,
  logicCategories,
  otherCategories,
  categoryDescriptions
} from '../constants/categories';

const getGradient = (index: number, offset: number = 0) => {
  const gradients = [
    'from-violet-600 to-fuchsia-700',
    'from-blue-600 to-indigo-700',
    'from-emerald-600 to-teal-700',
    'from-rose-500 to-orange-600',
    'from-cyan-600 to-blue-700',
    'from-amber-500 to-pink-600',
    'from-purple-600 to-indigo-600',
    'from-pink-500 to-rose-500'
  ];
  return gradients[(index + offset) % gradients.length];
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: statsResponse } = usePlatformStats();
  const stats = statsResponse?.data;

  const handleCategoryClick = (category: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(category)}`);
  };

  const [infoCategory, setInfoCategory] = React.useState<string | null>(null);

  const renderCarousel = (items: string[], title: string, gradientOffset: number) => {
    return (
      <div className="mb-8 lg:mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-100 w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 text-center lg:text-left">
          {title}
        </h2>
        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto hide-scrollbar w-full px-4 sm:px-6 lg:px-8 space-x-4 pb-4">
          {/* Duplicate items a few times for an "infinite" scroll feel */}
          {[...items, ...items, ...items, ...items].map((cat, idx) => {
            const count = stats?.books_by_category?.[cat];

            return (
              <div
                key={`${cat}-${idx}`}
                className={`flex-shrink-0 w-[240px] h-[140px] md:w-[280px] md:h-[160px] rounded-xl bg-gradient-to-br ${getGradient(idx, gradientOffset)} p-5 flex items-end cursor-pointer hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 relative overflow-hidden group/card`}
              >
                <div onClick={() => handleCategoryClick(cat)} className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />

                {/* Book count badge */}
                {count !== undefined && count > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 z-20">
                    {count} {count === 1 ? 'testo' : 'testi'}
                  </div>
                )}

                {/* Info Icon */}
                {categoryDescriptions[cat] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoCategory(cat);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/70 hover:text-white transition-all z-30 border border-white/10"
                    title="Info categoria"
                  >
                    <Info className="w-4 h-4 md:w-5 h-5" />
                  </button>
                )}

                <h3 onClick={() => handleCategoryClick(cat)} className="text-white text-lg md:text-xl font-bold relative z-10 drop-shadow-md leading-tight w-full pr-2">
                  {cat}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white pb-20 overflow-x-hidden relative">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Il nuovo <span className="text-violet-500">hub</span> per lo studio e la cultura.</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
            Esplora migliaia di libri scolastici, universitari e narrativa. Vendi i tuoi libri usati o trova l'ispirazione per la tua prossima lettura nel nostro catalogo infinito.
          </p>
        </div>

        {/* Info Pills in basso a destra */}
        {stats && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm rounded-full shadow-lg">
              <BookOpen className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_books} Libri</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm rounded-full shadow-lg">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_notes} Appunti</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm rounded-full shadow-lg">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_tutors} Docenti</span>
            </div>
          </div>
        )}
      </div>

      {/* Carousels Netflix Style (Manual Scroll) */}
      <div className="w-full mt-2">
        {renderCarousel(scholasticCategories, "Testi Scolastici & Università", 0)}
        {renderCarousel(narrativeCategories, "Narrativa & Letteratura", 2)}
        {renderCarousel(logicCategories, "Saggistica, Business & Crescita", 4)}
        {renderCarousel(otherCategories, "Fumetti, Arti & Passioni", 6)}
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
