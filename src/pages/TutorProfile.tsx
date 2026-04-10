import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTutor } from '../hooks/useTutoring';
import { Loader2, ArrowLeft, Star, Languages, BookOpen, MessageCircle, Clock } from 'lucide-react';

export const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tutorId = id || '';
  
  const { data: tutorResp, isLoading, isError } = useTutor(tutorId);
  const tutor = tutorResp?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 xl:px-12 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
          Docente non trovato o errore nel caricamento.
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-violet-400 font-medium">Torna indietro</button>
      </div>
    );
  }

  const handleStartChat = () => {
    // Navigate to inbox with query parameter to start chat 
    navigate(`/inbox?user=${tutor.id}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 xl:px-12 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla ricerca</span>
      </button>

      <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 relative"></div>
        
        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 mb-8">
            <div className="flex items-end gap-6 relative z-10">
              <div className="w-32 h-32 bg-gray-900 rounded-2xl border-4 border-gray-800 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                {tutor.user?.avatar_url ? (
                  <img src={tutor.user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-violet-500">
                    {tutor.user?.first_name?.[0] || 'D'}
                  </span>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                  {tutor.user?.first_name} {tutor.user?.last_name}
                </h1>
                <p className="text-violet-400 font-medium text-lg">Docente Privato</p>
              </div>
            </div>

            <div className="flex-shrink-0 relative z-10">
               <button 
                  onClick={handleStartChat}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contatta Docente
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Chi sono</h2>
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {tutor.bio || "Questo docente non ha ancora inserito una bio."}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4">Laurea e Titoli</h2>
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-300">
                    {tutor.degree || "Non specificato"}
                  </p>
                </div>
              </section>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Materie Insegnate</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects_taught?.map(sub => (
                      <span key={sub} className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
                        {sub}
                      </span>
                    )) || <span className="text-gray-500 text-sm">Non specificate</span>}
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Lingue Parlate</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.languages?.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
                        {lang}
                      </span>
                    )) || <span className="text-gray-500 text-sm">Non specificate</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Tariffa Oraria</h3>
                <div className="text-4xl font-black text-white mb-6">
                  €{tutor.hourly_rate}<span className="text-lg text-gray-500 font-medium">/ora</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{tutor.average_rating > 0 ? tutor.average_rating.toFixed(1) : 'Nuovo'}</div>
                      <div className="text-sm text-gray-400">Valutazione Media ({tutor.total_lessons} lez.)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Online e In presenza</div>
                      <div className="text-sm text-gray-400">Modalità lezioni</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
