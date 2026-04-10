import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInbox, useChat, useSendMessage } from '../hooks/useOperations';
import { useTutors } from '../hooks/useTutoring';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Send, User, MessageSquare, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import { ConversationSummary, Message } from '../types/operations';

export const Inbox: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user');
  const [activeTab, setActiveTab] = useState<'books' | 'tutors'>('books');
  
  const { user: currentUser } = useAuthStore();
  const { data: inboxResponse, isLoading: isLoadingInbox, isError: isErrorInbox } = useInbox();
  const { data: tutorsResponse, isLoading: isLoadingTutors } = useTutors({});
  
  // Custom hook per inviare messaggi
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState('');
  
  // Normalizza risposta: potrebbe essere { data: [] } oppure { data: { items: [] } }
  const rawInboxData = inboxResponse?.data;
  const allConversations: ConversationSummary[] = Array.isArray(rawInboxData)
    ? rawInboxData
    : (rawInboxData as any)?.items || [];
  
  const tutorsList = tutorsResponse?.data || [];
  const tutorIds = React.useMemo(() => new Set(tutorsList.map((t: any) => t.user_id)), [tutorsList]);
  
  useEffect(() => {
    if (selectedUserId && tutorIds.has(selectedUserId)) {
      setActiveTab('tutors');
    }
  }, [selectedUserId, tutorIds]);

  const conversations = allConversations.filter((conv: ConversationSummary) => {
    const isTutorConv = tutorIds.has(conv.user_id);
    return activeTab === 'tutors' ? isTutorConv : !isTutorConv;
  });

  // Seleziona la chat basata sul param URL
  const { data: chatResponse, isLoading: isLoadingChat } = useChat(selectedUserId);
  const messages = chatResponse?.data || [];


  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll in fondo ai messaggi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectUser = (userId: string) => {
    setSearchParams({ user: userId });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !newMessage.trim()) return;

    sendMessage.mutate(
      { userId: selectedUserId, content: newMessage },
      {
        onSuccess: () => setNewMessage('')
      }
    );
  };

  // Renderizzazione lista chat
  const renderSidebar = () => {
    if (isLoadingInbox || isLoadingTutors) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      );
    }
    if (isErrorInbox) {
      return (
        <div className="flex flex-col items-center p-6 m-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl gap-2">
          <AlertCircle className="w-6 h-6" />
          <p className="text-center font-medium">Errore durante il caricamento delle conversazioni.</p>
          <p className="text-xs text-red-400/70">Verifica la connessione al server e riprova.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Toggle per tipo di chat */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('books'); setSearchParams({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'books' 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Libri/Appunti
            </button>
            <button
              onClick={() => { setActiveTab('tutors'); setSearchParams({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'tutors' 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Docenti
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-center">
                Nessuna chat trovata in questa sezione
              </p>
            </div>
          ) : (
            conversations.map((conv: ConversationSummary, idx: number) => (
              <button
                key={conv.user_id || idx}
                onClick={() => handleSelectUser(conv.user_id)}
                className={`w-full text-left flex items-center gap-3 p-4 border-b border-gray-800 transition-colors ${
                  selectedUserId === conv.user_id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="relative">
                  {conv.avatar_url ? (
                    <img src={conv.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {conv.unread_count > 0 && selectedUserId !== conv.user_id && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-900">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-gray-200 truncate">
                      {conv.first_name} {conv.last_name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(conv.updated_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-gray-300 font-semibold' : 'text-gray-500'}`}>
                    {typeof conv.last_message === 'string' ? conv.last_message : conv.last_message?.content}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  // Renderizzazione finestra messaggi
  const renderChatArea = () => {
    if (!selectedUserId) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-900/50">
          <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium text-gray-400">Seleziona una chat</p>
          <p className="text-sm">Scegli dalla lista per iniziare a inviare messaggi</p>
        </div>
      );
    }

    if (isLoadingChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-900/50">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      );
    }

    const recipient = conversations.find(c => c.user_id === selectedUserId);

    return (
      <div className="flex-1 flex flex-col bg-gray-900/30">
        {/* Header Chat */}
        <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            {recipient?.avatar_url ? (
              <img src={recipient.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-200">
              {recipient ? `${recipient.first_name} ${recipient.last_name}` : 'Utente Selezionato'}
            </h3>
          </div>
        </div>

        {/* Scroll dei messaggi */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">
              Nessun messaggio precedente. Scrivi per primo!
            </div>
          ) : (
            messages.map((msg: Message) => {
              const isMine = msg.sender_id === currentUser?.id;
              
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      isMine 
                        ? 'bg-violet-600 text-white rounded-br-sm' 
                        : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-[10px] mt-1 ${isMine ? 'text-violet-200' : 'text-gray-500'} text-right`}>
                      {new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex items-end gap-2 bg-gray-800 rounded-2xl p-2 border border-gray-700 focus-within:border-violet-500 transition-colors">
            <textarea
              className="flex-1 bg-transparent text-gray-200 p-2 text-sm focus:outline-none resize-none hide-scrollbar min-h-[44px] max-h-32"
              placeholder="Scrivi un messaggio..."
              rows={1}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sendMessage.isPending}
              className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px)]">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex h-full">
        {/* Colonna Sinistra (Lista Chat) */}
        <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-800 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-800 px-6">
            <h2 className="text-xl font-bold text-white">Messaggi</h2>
          </div>
          {renderSidebar()}
        </div>

        {/* Colonna Destra (Chat Attiva) */}
        <div className={`flex-1 flex-col ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          {renderChatArea()}
        </div>
      </div>
    </div>
  );
};
