import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg(null);

    try {
      const response = await authService.resetPassword({ email });
      if (!response.success) {
        throw new Error(response.error?.message || 'Si è verificato un errore');
      }
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore imprevisto.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email inviata</h2>
          <p className="text-gray-500 mb-6">Controlla la tua casella di posta per reimpostare la password.</p>
          <button onClick={() => navigate('/login')} className="text-violet-700 font-semibold hover:text-violet-800">
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2 text-sm">Inserisci l'email associata al tuo account</p>
        </div>

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 px-4 bg-violet-700 hover:bg-violet-800 text-white font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 disabled:opacity-50"
          >
            {status === 'loading' ? 'Invio in corso...' : 'Invia Link di Reset'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-gray-800 font-medium">
            Annulla e torna indietro
          </button>
        </div>
      </div>
    </div>
  );
};
