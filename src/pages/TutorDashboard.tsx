import React from 'react';
import { useMyTutorSessions, useConfirmSession, useCancelSession, useCompleteSession } from '../hooks/useTutoring';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { TutoringSession } from '../types/tutoring';

export const TutorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data: sessionsResponse, isLoading: sessionsLoading } = useMyTutorSessions();
  const confirmSessionMutation = useConfirmSession();
  const cancelSessionMutation = useCancelSession();
  const completeSessionMutation = useCompleteSession();

  if (!user?.is_tutor) {
    return (
      <div className="text-center py-20 text-gray-400">
        Non sei registrato come docente. Usa il menu per diventare tutor.
      </div>
    );
  }

  const sessionsResponseData: any = sessionsResponse?.data;
  const sessions = Array.isArray(sessionsResponseData) ? sessionsResponseData : (sessionsResponseData?.items || []);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Docente</h1>
          <p className="text-gray-400 mt-2">Pannello di controllo per la gestione delle lezioni.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Le tue Lezioni</h2>
          {sessionsLoading ? (
             <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>
          ) : sessions.length === 0 ? (
             <div className="text-center py-12 text-gray-400">Non hai ancora ricevuto richieste di lezioni.</div>
          ) : (
             <div className="grid gap-4">
               {sessions.map((session: TutoringSession) => (
                 <div key={session.id} className="border border-gray-700 bg-gray-900 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-violet-500/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                           session.status === 'Programmata' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                           session.status === 'Confermata' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                           session.status === 'Completata' ? 'bg-gray-800 text-gray-400 border border-gray-600' :
                           'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {session.status}
                        </span>
                        <span className="font-bold text-white text-lg">{session.subject}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        👤 Studente: <span className="font-medium text-gray-200">{session.student?.first_name} {session.student?.last_name || 'Utente'}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                         <Calendar className="w-4 h-4" /> {new Date(session.scheduled_at).toLocaleDateString('it-IT')} 
                         <Clock className="w-4 h-4 ml-2" /> {new Date(session.scheduled_at).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})} 
                         <span className="ml-2 font-medium text-gray-300">({session.duration_minutes} min)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto mt-3 md:mt-0">
                      {session.status === 'Programmata' && (
                        <>
                         <button onClick={() => confirmSessionMutation.mutate(session.id)} disabled={confirmSessionMutation.isPending} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold rounded-xl hover:bg-emerald-600/30 transition-colors">Conferma</button>
                         <button onClick={() => cancelSessionMutation.mutate(session.id)} disabled={cancelSessionMutation.isPending} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition-colors">Annulla</button>
                        </>
                      )}
                      {session.status === 'Confermata' && (
                         <>
                           <button onClick={() => completeSessionMutation.mutate(session.id)} disabled={completeSessionMutation.isPending} className="flex-1 md:flex-none px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"><CheckCircle className="w-4 h-4 inline mr-1"/> Segna Completata</button>
                           <button onClick={() => cancelSessionMutation.mutate(session.id)} disabled={cancelSessionMutation.isPending} className="flex-1 md:flex-none px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition-colors">Annulla</button>
                         </>
                      )}
                    </div>
                 </div>
               ))}
               </div>
          )}
        </div>
      </div>
    </div>
  );
};
