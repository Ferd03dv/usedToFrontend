import React from 'react';
import { usePlatformStats } from '../../hooks/useOperations';
import { BookOpen, Users, FileText, Loader2, AlertCircle } from 'lucide-react';

export const HeroHeader: React.FC = () => {
  const { data: response, isLoading, isError } = usePlatformStats();
  const stats = response?.data;

  return (
    <div className="w-full relative py-12 lg:py-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8">
        Il tuo <span className="text-violet-500">hub</span> per lo studente
      </h1>
      
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            <span className="text-sm font-medium text-gray-300">Caricamento statistiche...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Statistiche non disponibili</span>
          </div>
        )}

        {!isLoading && !isError && stats && (
          <>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-full shadow-lg">
              <BookOpen className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_books} Libri</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-full shadow-lg">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_tutors} Docenti</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-full shadow-lg">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-gray-100">{stats.total_notes} Appunti</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
