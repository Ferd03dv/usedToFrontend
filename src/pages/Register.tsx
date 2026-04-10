import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/auth.service';
import { RegisterStep1Payload } from '../types/auth';

export const Register: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterStep1Payload>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_tutor: false,
  });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await authService.registerStep1(formData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Errore durante la registrazione');
      }

      setAuth(response.data.user, response.data.session.access_token);
      
      // Se l'utente è un tutor o ha bisogno di completare il profilo, redirigi allo step 2
      if (response.data.user.needs_tutor_profile_completion || formData.is_tutor) {
        navigate('/tutor-onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore imprevisto. Controlla i dati immessi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 py-10 selection:bg-violet-500/30">
      <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 sm:p-10 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Crea un Account</h2>
          <p className="text-gray-400 mt-2 text-sm">Unisciti alla community di Student Hub</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Nome</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 ml-1">Cognome</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-500"
              required
            />
          </div>

          <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors group focus-within:ring-2 focus-within:ring-violet-500 bg-gray-900 shadow-sm mt-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.is_tutor}
                onChange={(e) => setFormData({ ...formData, is_tutor: e.target.checked })}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-600 rounded peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all flex items-center justify-center bg-gray-800">
                {formData.is_tutor && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Voglio registrarmi come Tutor</p>
              <p className="text-gray-400 text-xs mt-0.5">Potrai impartire ripetizioni agli altri studenti</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-600 disabled:opacity-50 flex justify-center items-center"
          >
             {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             ) : (
               'Crea Account'
             )}
          </button>
        </form>
      </div>
      
      <p className="text-center text-gray-400 text-sm">
        Hai già un account?{' '}
        <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors focus:outline-none focus:underline">
          Accedi qui
        </Link>
      </p>
    </div>
  );
};
