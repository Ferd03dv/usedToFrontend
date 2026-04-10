import React, { useState } from 'react';
import { useReportBug } from '../../hooks/useOperations';
import { Bug, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const BugReporter: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  
  const reportBug = useReportBug();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    reportBug.mutate(
      { title, description, device_info: deviceInfo },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setDeviceInfo('');
        }
      }
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl w-full max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/10 rounded-xl">
          <Bug className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Segnala un Bug</h2>
          <p className="text-sm text-gray-400">Hai trovato un problema? Facci sapere per migliorare Student Hub.</p>
        </div>
      </div>

      {reportBug.isSuccess ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Segnalazione inviata!</h4>
            <p className="text-sm">Grazie per il tuo contributo. Il nostro team prenderà in carico la segnalazione al più presto.</p>
            <button 
              onClick={() => reportBug.reset()} 
              className="mt-3 text-sm text-emerald-500 hover:text-emerald-400 underline underline-offset-4"
            >
              Invia un'altra segnalazione
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {reportBug.isError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Si è verificato un errore durante l'invio. Riprova più tardi.</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Titolo del problema <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Es. Il bottone acquista non funziona"
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrizione dettagliata <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Descrivi i passaggi per riprodurre il problema..."
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Dispositivo / Browser (Opzionale)
            </label>
            <input
              type="text"
              value={deviceInfo}
              onChange={(e) => setDeviceInfo(e.target.value)}
              placeholder="Es. iPhone 13, Safari o Windows 11, Chrome"
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={reportBug.isPending || !title.trim() || !description.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {reportBug.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Invio in corso...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Invia Segnalazione
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
