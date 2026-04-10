import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notification.service';
import { Notification } from '../types/models';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getUnread();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Le tue Notifiche</h1>
          <p className="text-gray-400 mt-1">Gestisci i tuoi avvisi e le interazioni.</p>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-md"
          >
            Segna tutte come lette
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Caricamento notifiche...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Nessuna nuova notifica</h3>
          <p className="text-gray-400 text-sm">Sei in pari con tutti gli avvisi.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`bg-gray-800 p-5 rounded-2xl border ${notif.is_read ? 'border-gray-700' : 'border-violet-500/50'} shadow-sm flex items-start gap-4 transition-all hover:border-violet-500`}>
               <div className="w-10 h-10 mt-1 rounded-full bg-gray-900 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-white">{notif.title}</h4>
                 <p className="text-gray-300 text-sm mt-1">{notif.message}</p>
                 <div className="mt-3 flex items-center gap-4">
                    {notif.link_url && (
                      <a href={notif.link_url} className="text-sm font-semibold text-violet-400 hover:text-violet-300">Visualizza dettagli</a>
                    )}
                    <button 
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Segna come letta
                    </button>
                 </div>
               </div>
               <div className="text-xs text-gray-500">
                  {new Date(notif.created_at).toLocaleDateString()}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
