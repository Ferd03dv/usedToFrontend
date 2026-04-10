import React, { useState, useMemo } from 'react';
import { useTutors } from '../hooks/useTutoring';
import { TutorProfileData } from '../types/tutoring';
import { Loader2, Search, Star, Languages, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const TutorsFeed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [minRate, setMinRate] = useState<number | ''>('');
  const [maxRate, setMaxRate] = useState<number | ''>('');
  const [language, setLanguage] = useState('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');

  // Clean params to skip empty strings
  const params = useMemo(() => {
    const cleaned: any = {};
    if (subject) cleaned.subject = subject;
    if (minRate) cleaned.min_rate = minRate;
    if (maxRate) cleaned.max_rate = maxRate;
    if (language) cleaned.language = language;
    if (minRating) cleaned.min_rating = minRating;
    if (onlyOnline) cleaned.only_online = true;
    if (city) cleaned.city = city;
    if (profession) cleaned.profession = profession;
    return cleaned;
  }, [subject, minRate, maxRate, language, minRating, onlyOnline, city, profession]);

  const { data: response, isLoading, isError } = useTutors(params);
  const tutors = response?.data || [];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 px-4 md:px-8 xl:px-12 py-8 h-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-24 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-6">Filtra Docenti</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Materia d'insegnamento</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Es. Matematica, Fisica..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Tariffa Oraria (€)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Lingua Parlata</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Es. Inglese, Spagnolo..."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Valutazione Minima</label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none"
                >
                  <option value="">Qualsiasi valutazione</option>
                  <option value="4">4+ Stelle</option>
                  <option value="3">3+ Stelle</option>
                  <option value="2">2+ Stelle</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyOnline(!onlyOnline)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${onlyOnline ? 'bg-violet-600' : 'bg-gray-600'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${onlyOnline ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <label className="text-sm font-semibold text-gray-300 cursor-pointer" onClick={() => setOnlyOnline(!onlyOnline)}>Solo Lezioni Online</label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Città</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Es. Milano, Roma..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Professione</label>
              <div className="relative">
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none"
                >
                  <option value="">Qualsiasi</option>
                  <option value="docente">Docente</option>
                  <option value="libero professionista">Libero Professionista</option>
                  <option value="dipendente">Dipendente</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSubject('');
                setMinRate('');
                setMaxRate('');
                setLanguage('');
                setMinRating('');
                setOnlyOnline(false);
                setCity('');
                setProfession('');
              }}
              className="w-full py-2 px-4 bg-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Ripristina Filtri
            </button>
          </div>
        </div>
      </div>

      {/* Tutors List */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">Lezioni Private</h1>
          {user && !user.is_tutor && (
            <button
              onClick={() => navigate('/tutor-onboarding')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              <GraduationCap className="w-5 h-5" />
              Diventa Docente
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            Nessun docente trovato o errore nel caricamento.
          </div>
        ) : tutors.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 p-12 rounded-2xl text-center text-gray-400">
            Non ci sono docenti disponibili con i filtri attuali.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {tutors.map((tutor: TutorProfileData) => (
              <div 
                key={tutor.id} 
                onClick={() => navigate(`/tutors/${tutor.id}`)}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-violet-500 transition-colors cursor-pointer flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-violet-500 transition-colors overflow-hidden">
                      {tutor.user?.avatar_url ? (
                        <img src={tutor.user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-violet-400">
                          {tutor.user?.first_name?.[0] || 'D'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {tutor.user?.first_name || 'Docente'} {tutor.user?.last_name || ''}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{tutor.average_rating > 0 ? tutor.average_rating.toFixed(1) : 'Nuovo'}</span>
                        <span className="text-gray-500 text-xs ml-1">({tutor.total_lessons} lez.)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-violet-400">€{tutor.hourly_rate}</div>
                    <div className="text-xs text-gray-500">/ ora</div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                  {tutor.bio}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-700 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-full text-xs font-medium text-gray-300">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate max-w-[120px]">{tutor.subjects_taught?.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-full text-xs font-medium text-gray-300">
                    <Languages className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tutor.languages?.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
