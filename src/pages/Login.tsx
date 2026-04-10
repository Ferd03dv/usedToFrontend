import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/auth.service';

export const Login: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Errore durante il login');
      }

      setAuth(response.data.user, response.data.session.access_token);
      
      // Controllo se è un tutor e ha lasciato la procedura in sospeso
      if (response.data.user.needs_tutor_profile_completion) {
        navigate('/tutor-onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenziali non valide. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 sm:p-10 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Bentornato</h2>
          <p className="text-gray-400 mt-2 text-sm">Accedi al tuo account Student Hub</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-start gap-3">
            <span className="text-red-400 text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="mario.rossi@studenti.it"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-600 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Accedi'
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-gray-400 text-sm">
        Non hai un account?{' '}
        <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors focus:outline-none focus:underline">
          Registrati ora
        </Link>
      </p>
    </div>
  );
};
