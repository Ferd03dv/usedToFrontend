import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterTutor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    bio: '',
    hourly_rate: 15,
    subjects: 'Matematica, Fisica',
    languages: 'Italiano, Inglese',
    only_online: false,
    city: '',
    max_distance: '',
    work: '',
    profession: 'docente' as 'docente' | 'libero professionista' | 'dipendente',
    degree: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Convert string inputs to arrays for the API
    const subjects_taught = formData.subjects.split(',').map(sub => sub.trim()).filter(Boolean);
    const languages = formData.languages.split(',').map(lang => lang.trim()).filter(Boolean);

    try {
      const payload = {
        bio: formData.bio,
        hourly_rate: formData.hourly_rate,
        subjects_taught,
        languages,
        only_online: formData.only_online,
        city: formData.city || undefined,
        max_distance: formData.max_distance ? parseInt(formData.max_distance) : undefined,
        work: formData.work || undefined,
        profession: formData.profession,
        degree: formData.degree || undefined
      };
      
      const response = await authService.registerTutorStep2(payload);
      if (!response.success && response.success !== undefined) {
          // If the API returns success: false explicitly, though some APIs might not return it for 2xx
          throw new Error(response.error?.message || "Errore durante il salvataggio.");
      }
      
      // Aggiorna lo store locale: l'utente ha completato il profilo setup
      if (user) {
        useAuthStore.getState().setAuth(
          { ...user, is_tutor: true, needs_tutor_profile_completion: false },
          useAuthStore.getState().token!
        );
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Controlla i campi inseriti e riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.is_tutor && !user?.needs_tutor_profile_completion) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sei già un docente</h2>
        <p className="text-gray-600 mb-6">Il tuo profilo tutor è già stato completato. Puoi modificarlo dal tuo profilo.</p>
        <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-violet-700 text-white rounded-xl">Vai al Profilo</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 py-12 relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-xl bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Diventa Docente</h2>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">Completa il tuo profilo per iniziare a dare lezioni. Fatti trovare dagli studenti sulla nostra piattaforma.</p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center">
            <span className="text-red-400 text-sm font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Presentazione (Bio)</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white min-h-[120px] outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all resize-y"
              required
              placeholder="Cosa ti rende un ottimo insegnante? Descrivi il tuo metodo..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Tariffa Oraria (€)</label>
            <input
              type="number"
              min="5"
              step="0.5"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) })}
              className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-emerald-400 font-bold text-lg outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Materie (separate da virgola)</label>
            <input
              type="text"
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
              required
              placeholder="Es. Matematica, Fisica, Inglese"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Lingue parlate (separate da virgola)</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
              required
              placeholder="Es. Italiano, Inglese (B2)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <div className="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:border-gray-600">
              <label className="text-sm font-medium text-gray-300">Tipo di Lezioni</label>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, only_online: !formData.only_online })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${formData.only_online ? 'bg-violet-600' : 'bg-gray-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.only_online ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm font-medium text-gray-400">{formData.only_online ? 'Solo Online' : 'Anche in presenza'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Professione</label>
              <select
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value as any })}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none"
              >
                <option value="docente">Docente</option>
                <option value="libero professionista">Libero Professionista</option>
                <option value="dipendente">Dipendente</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Città in cui vivi (opz.)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                placeholder="es. Milano"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Distanza massima (km)</label>
              <input
                type="number"
                min="0"
                value={formData.max_distance}
                onChange={(e) => setFormData({ ...formData, max_distance: e.target.value })}
                disabled={formData.only_online}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all disabled:opacity-50 disabled:bg-gray-800"
                placeholder={formData.only_online ? "N/A" : "es. 20 (opz.)"}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Luogo di lavoro / Scuola (opz.)</label>
              <input
                type="text"
                value={formData.work}
                onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                placeholder="es. I.I.S. Marconi"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Titolo di studi (opz.)</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white outline-none placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                placeholder="es. Laurea Magistrale in Fisica"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-violet-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-800 disabled:opacity-50 hover:bg-violet-500"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Salvataggio...
                  </>
                ) : 'Completa Profilo Docente'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

