import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/user.service';
import { Profile } from '../types/auth';
import { User, GraduationCap, XCircle, Camera } from 'lucide-react';
import { useMyTutorProfile, useUpdateMyTutorProfile } from '../hooks/useTutoring';
import { ImageUploadZone } from '../components/marketplace/ImageUploadZone';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../lib/imageUrl';

export const MyProfile: React.FC = () => {
  const { user, setAuth, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'user' | 'tutor'>('user');

  // User Profile
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Tutor Profile
  const { data: tutorProfileResponse, isLoading: isTutorLoading } = useMyTutorProfile();
  const updateProfileMutation = useUpdateMyTutorProfile();
  
  const [tutorData, setTutorData] = useState({
    bio: '',
    hourly_rate: 0,
    languages: [] as string[],
    subjects_taught: [] as string[],
    is_active: false,
    only_online: false,
    city: '',
    max_distance: '',
    work: '',
    profession: 'docente' as 'docente' | 'libero professionista' | 'dipendente',
    degree: ''
  });
  const [langInput, setLangInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [tutorStatusMsg, setTutorStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        is_tutor: user.is_tutor,
        avatar_url: (user as any).avatar_url || null,
        bio: (user as any).bio || '',
        university: (user as any).university || '',
        degree_course: (user as any).degree_course || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (tutorProfileResponse?.data) {
      setTutorData({
        bio: tutorProfileResponse.data.bio || '',
        hourly_rate: tutorProfileResponse.data.hourly_rate || 0,
        languages: tutorProfileResponse.data.languages || [],
        subjects_taught: tutorProfileResponse.data.subjects_taught || [],
        is_active: tutorProfileResponse.data.is_active ?? true,
        only_online: tutorProfileResponse.data.only_online ?? false,
        city: tutorProfileResponse.data.city || '',
        max_distance: tutorProfileResponse.data.max_distance ? String(tutorProfileResponse.data.max_distance) : '',
        work: tutorProfileResponse.data.work || '',
        profession: tutorProfileResponse.data.profession || 'docente',
        degree: tutorProfileResponse.data.degree || ''
      });
    }
  }, [tutorProfileResponse]);

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserLoading(true);
    setUserStatus(null);
    try {
      const response = await userService.updateMe(profile);
      if (response.success && response.data) {
        setUserStatus({type: 'success', text: 'Profilo Utente aggiornato con successo!'});
        if (user && token) {
          setAuth({ ...user, ...response.data }, token);
        }
      } else {
        throw new Error(response.error?.message);
      }
    } catch (err: any) {
      setUserStatus({type: 'error', text: `Errore: ${err.message}`});
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...tutorData,
      max_distance: tutorData.max_distance ? parseInt(tutorData.max_distance) : undefined,
    };

    updateProfileMutation.mutate(payload as any, {
      onSuccess: () => {
        setTutorStatusMsg({ type: 'success', text: 'Profilo Docente salvato con successo!' });
        setTimeout(() => setTutorStatusMsg(null), 3000);
      },
      onError: (err: any) => {
        setTutorStatusMsg({ type: 'error', text: err.message || 'Errore durante il salvataggio.' });
      }
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.")) {
      try {
        await userService.deleteMe();
        logout();
      } catch (err) {
        alert("Errore durante l'eliminazione dell'account.");
      }
    }
  };

  const handleAddArrayItem = (field: 'languages' | 'subjects_taught', value: string, setValue: (v: string) => void) => {
    if (!value.trim() || tutorData[field].includes(value.trim())) return;
    setTutorData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setValue('');
  };

  const handleRemoveArrayItem = (field: 'languages' | 'subjects_taught', index: number) => {
    setTutorData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 min-h-[calc(100vh-4rem)] font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestione Profilo</h1>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden mb-12">
        
        {/* Modern Pills Tabs */}
        <div className="flex justify-center p-4 sm:p-6 border-b border-gray-700/50 bg-gray-900/20">
          <div className="flex bg-gray-900/80 p-1.5 rounded-2xl border border-gray-700/50 shadow-inner">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex items-center gap-2 py-2.5 px-6 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'user' 
                  ? 'bg-violet-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              Profilo Utente
            </button>
            {user?.is_tutor && (
              <button
                onClick={() => setActiveTab('tutor')}
                className={`flex items-center gap-2 py-2.5 px-6 text-sm font-bold rounded-xl transition-all ${
                  activeTab === 'tutor' 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Dati Docente
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {activeTab === 'user' && (
            <div className="max-w-2xl mx-auto">
              {userStatus && (
                <div className={`mb-8 p-4 rounded-2xl text-sm font-semibold text-center ${userStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {userStatus.text}
                </div>
              )}

              <form onSubmit={handleUserUpdate} className="space-y-8">
                
                {/* Avatar Circular Upload */}
                <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative w-36 h-36 rounded-full border-4 border-gray-800 bg-gray-900 shadow-xl flex items-center justify-center overflow-hidden group">
                    {profile.avatar_url ? (
                      <>
                        <img src={getImageUrl(profile.avatar_url)} alt="Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={() => setProfile({...profile, avatar_url: null})} 
                            className="text-xs font-bold text-white bg-red-600/90 px-4 py-2 rounded-xl hover:bg-red-700 backdrop-blur-sm transition-colors"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-0 z-10 scale-[2.5] cursor-pointer">
                           <ImageUploadZone 
                             onUploadSuccess={(paths) => setProfile(prev => ({ ...prev, avatar_url: paths[0] }))}
                             maxFiles={1}
                           />
                        </div>
                        <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-violet-400 transition-colors pointer-events-none">
                          <Camera className="w-10 h-10 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Carica Foto</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Nome</label>
                    <input
                      type="text"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Cognome</label>
                    <input
                      type="text"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Università</label>
                    <input
                      type="text"
                      value={profile.university || ''}
                      onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                      placeholder="es. Politecnico di Milano"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Corso di Laurea</label>
                    <input
                      type="text"
                      value={profile.degree_course || ''}
                      onChange={(e) => setProfile({ ...profile, degree_course: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                      placeholder="es. Ingegneria Informatica"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">Biografia Utente</label>
                    <textarea
                      rows={4}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all resize-y"
                      placeholder="Racconta qualcosa di te agli altri studenti..."
                    />
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {!user?.is_tutor && (
                    <button
                      type="button"
                      onClick={() => navigate('/tutor-onboarding')}
                      className="w-full sm:w-auto px-6 py-4 bg-gray-900/80 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all border border-gray-700 flex items-center justify-center gap-2 group"
                    >
                      <GraduationCap className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                      Diventa Docente
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isUserLoading}
                    className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-lg transition-all focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 sm:ml-auto"
                  >
                    {isUserLoading ? 'Salvataggio...' : 'Salva Profilo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'tutor' && user?.is_tutor && (
            <div className="max-w-3xl mx-auto">
              
              {tutorStatusMsg && (
                <div className={`mb-8 p-4 rounded-2xl text-sm font-semibold text-center ${tutorStatusMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {tutorStatusMsg.text}
                </div>
              )}
              
              {isTutorLoading ? (
                 <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div></div>
              ) : (
                <form onSubmit={handleTutorSubmit} className="space-y-8">
                  
                  {/* Public Visibility Toggle */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-violet-600/10 to-transparent border border-violet-500/20 rounded-3xl">
                     <div>
                       <h3 className="text-lg font-bold text-white">Profilo Pubblico</h3>
                       <p className="text-sm text-violet-200/60 mt-1">Appari nei risultati di ricerca agli studenti.</p>
                     </div>
                     <div className="mt-4 sm:mt-0 flex items-center gap-4">
                       <span className={`text-sm font-bold ${tutorData.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {tutorData.is_active ? 'Attivo' : 'In Pausa'}
                       </span>
                       <button
                         type="button"
                         onClick={() => setTutorData({ ...tutorData, is_active: !tutorData.is_active })}
                         className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${tutorData.is_active ? 'bg-emerald-500' : 'bg-gray-700'}`}
                       >
                         <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${tutorData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Presentazione Tutor</label>
                      <textarea
                        rows={4}
                        value={tutorData.bio}
                        onChange={(e) => setTutorData({ ...tutorData, bio: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all resize-y"
                        placeholder="Descrivi il tuo metodo di insegnamento..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Professione</label>
                      <select
                        value={tutorData.profession}
                        onChange={(e) => setTutorData({ ...tutorData, profession: e.target.value as any })}
                        className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none"
                      >
                        <option value="docente">Docente</option>
                        <option value="libero professionista">Libero Professionista</option>
                        <option value="dipendente">Dipendente</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Tariffa Oraria (€/h)</label>
                      <input
                        type="number"
                        min="5"
                        step="0.5"
                        value={tutorData.hourly_rate}
                        onChange={(e) => setTutorData({ ...tutorData, hourly_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-emerald-400 font-bold text-lg focus:bg-gray-900 focus:border-violet-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Titolo di studi</label>
                      <input
                        type="text"
                        value={tutorData.degree}
                        onChange={(e) => setTutorData({ ...tutorData, degree: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        placeholder="es. Laurea Magistrale in Fisica"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Luogo di lavoro / Scuola</label>
                      <input
                        type="text"
                        value={tutorData.work}
                        onChange={(e) => setTutorData({ ...tutorData, work: e.target.value })}
                        className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        placeholder="es. I.I.S. Marconi"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2 bg-gray-900/30 border border-gray-700/40 rounded-3xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Lezioni Solo Online</p>
                          <p className="text-xs text-gray-500 mt-1">Scegli la modalità di insegnamento</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setTutorData({ ...tutorData, only_online: !tutorData.only_online })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${tutorData.only_online ? 'bg-violet-600' : 'bg-gray-700'}`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tutorData.only_online ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-sm text-gray-400 font-medium w-36">
                            {tutorData.only_online ? 'Solo Online' : 'Anche in presenza'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Città</label>
                          <input
                            type="text"
                            value={tutorData.city}
                            onChange={(e) => setTutorData({ ...tutorData, city: e.target.value })}
                            disabled={tutorData.only_online}
                            className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 transition-all disabled:opacity-50 disabled:bg-gray-900/80"
                            placeholder={tutorData.only_online ? 'N/A' : 'es. Milano'}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Distanza max (km)</label>
                          <input
                            type="number"
                            min="0"
                            value={tutorData.max_distance}
                            onChange={(e) => setTutorData({ ...tutorData, max_distance: String(e.target.value) })}
                            disabled={tutorData.only_online}
                            className="w-full px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 transition-all disabled:opacity-50 disabled:bg-gray-900/80"
                            placeholder={tutorData.only_online ? "N/A" : "es. 20 (opzionale)"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2 pt-4">
                      <label className="text-sm font-medium text-gray-400 ml-1">Materie Insegnate</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={subjectInput}
                          onChange={(e) => setSubjectInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('subjects_taught', subjectInput, setSubjectInput))}
                          className="flex-1 px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                          placeholder="Es: Matematica..."
                        />
                        <button type="button" onClick={() => handleAddArrayItem('subjects_taught', subjectInput, setSubjectInput)} className="px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-2xl font-bold transition-all shadow-sm">Aggiungi</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tutorData.subjects_taught.map((sub, i) => (
                          <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold transition-colors hover:bg-blue-500/20">
                            {sub} <XCircle className="w-4 h-4 cursor-pointer hover:text-blue-300" onClick={() => handleRemoveArrayItem('subjects_taught', i)} />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Lingue Parlate</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={langInput}
                          onChange={(e) => setLangInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('languages', langInput, setLangInput))}
                          className="flex-1 px-5 py-3.5 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-white placeholder-gray-500 outline-none focus:bg-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                          placeholder="Es: Inglese (C1)..."
                        />
                        <button type="button" onClick={() => handleAddArrayItem('languages', langInput, setLangInput)} className="px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-2xl font-bold transition-all shadow-sm">Aggiungi</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tutorData.languages.map((lang, i) => (
                          <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold transition-colors hover:bg-emerald-500/20">
                            {lang} <XCircle className="w-4 h-4 cursor-pointer hover:text-emerald-300" onClick={() => handleRemoveArrayItem('languages', i)} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="w-full sm:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all shadow-lg focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                    >
                      {updateProfileMutation.isPending ? 'Salvataggio...' : 'Salva Profilo Docente'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-900/30 rounded-3xl p-8 max-w-2xl mx-auto flex flex-col items-center text-center mt-12 mb-10">
        <h3 className="text-lg font-bold text-red-500 mb-2">Opzioni Pericolose</h3>
        <p className="text-red-400/80 text-sm mb-6 max-w-md mx-auto">
          L'eliminazione dell'account cancellerà in modo permanente tutti i tuoi dati, i messaggi, gli annunci e le recensioni. Questa azione è irreversibile.
        </p>
        <button
          onClick={handleDelete}
          className="px-6 py-3 bg-red-900/40 hover:bg-red-800/80 text-red-100 font-semibold rounded-xl transition-all border border-red-800/50 flex items-center justify-center gap-2 shadow-sm"
        >
          <XCircle className="w-5 h-5" />
          Sì, Elimina Account
        </button>
      </div>
    </div>
  );
};
