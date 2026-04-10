import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useInbox } from '../hooks/useOperations';
import { Plus, Bell, MessageCircle, Star, Menu, X, Book, Home, Users, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: inboxResponse } = useInbox();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Blocca scroll quando il menu mobile è aperto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const rawInboxData = inboxResponse?.data;
  const allConversations = Array.isArray(rawInboxData) ? rawInboxData : (rawInboxData as any)?.items || [];
  const totalUnreadCount = allConversations.reduce((acc: number, conv: any) => acc + (conv.unread_count || 0), 0);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm transition-all duration-300">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none">
              <span className="text-2xl font-black text-violet-500">Student</span>
              <span className="text-xl font-medium text-gray-200">Hub</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 ml-8 mr-auto">
              <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/tutors" className="text-gray-300 hover:text-white font-medium transition-colors">
                Docenti
              </Link>
              {isAuthenticated && (
                <Link to="/my-requests" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Trova Libro
                </Link>
              )}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-violet-400 border-2 border-violet-500/50 hover:bg-violet-500/10 font-semibold transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  >
                    Accedi
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 shadow-md transition-all focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                  >
                    Registrati
                  </Link>
                </>
              ) : (
                <div ref={menuRef} className="relative flex items-center gap-3">
                  <Link
                    to="/marketplace/create"
                    className="flex items-center justify-center p-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-md"
                    title="Vendi un articolo"
                  >
                    <Plus className="w-5 h-5 font-bold" />
                  </Link>

                  <Link to="/inbox" className="p-2 text-gray-400 hover:text-violet-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-full relative" title="Messaggi">
                    <MessageCircle className="w-6 h-6" />
                    {totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-900">
                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/favorites" className="p-2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full relative" title="Preferiti">
                    <Star className="w-6 h-6" />
                  </Link>

                  <Link to="/notifications" className="p-2 text-gray-400 hover:text-violet-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-full relative" title="Notifiche">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-gray-900 rounded-full"></span>
                  </Link>

                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="ml-2 flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 border-2 border-gray-700 text-violet-400 font-bold hover:border-violet-500 transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  >
                    {getUserInitials()}
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-12 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-2 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                        <p className="text-sm font-semibold text-gray-100 truncate">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>

                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        Impostazioni Profilo
                      </Link>

                      <Link to="/my-listings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        I Miei Annunci
                      </Link>

                      {user?.is_tutor && (
                        <Link to="/tutor-dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                          Dashboard Docente
                        </Link>
                      )}

                      <Link to="/report-bug" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        Segnala un Bug
                      </Link>

                      <Link to="/my-requests" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        Richieste / Trova Libro
                      </Link>

                      <div className="h-px bg-gray-700 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Disconnetti
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center gap-2">
              {isAuthenticated && (
                <Link
                  to="/marketplace/create"
                  className="flex items-center justify-center p-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                  title="Vendi un articolo"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none"
                aria-label="Apri menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <div
            ref={mobileMenuRef}
            className="absolute top-16 right-0 w-72 max-h-[calc(100vh-64px)] overflow-y-auto bg-gray-900 border-l border-b border-gray-800 shadow-2xl rounded-bl-2xl"
          >
            {/* Utente info (se autenticato) */}
            {isAuthenticated && (
              <div className="px-5 py-4 border-b border-gray-800 bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-violet-500 flex items-center justify-center text-violet-400 font-bold text-sm">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav links - Sezione Esplora */}
            <div className="px-3 py-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Esplora</p>
              <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Home className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Book className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Marketplace</span>
              </Link>
              <Link to="/tutors" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Docenti</span>
              </Link>
            </div>

            {isAuthenticated ? (
              <>
                {/* Sezione Personale */}
                <div className="px-3 py-3 border-t border-gray-800">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">I tuoi spazi</p>
                  <Link to="/inbox" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors relative">
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      {totalUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-gray-900">
                          {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">Chat</span>
                  </Link>
                  <Link to="/favorites" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <Star className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Preferiti</span>
                  </Link>
                  <Link to="/notifications" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors relative">
                    <div className="relative">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
                    </div>
                    <span className="font-medium">Notifiche</span>
                  </Link>
                  <Link to="/my-requests" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <Search className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Trova Libro</span>
                  </Link>
                </div>

                {/* Sezione Profilo */}
                <div className="px-3 py-3 border-t border-gray-800">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Profilo</p>
                  <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <span className="font-medium">Impostazioni Profilo</span>
                  </Link>
                  <Link to="/my-listings" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <span className="font-medium">I Miei Annunci</span>
                  </Link>
                  {user?.is_tutor && (
                    <Link to="/tutor-dashboard" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                      <span className="font-medium">Dashboard Docente</span>
                    </Link>
                  )}
                  <Link to="/report-bug" onClick={closeMobileMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <span className="font-medium">Segnala un Bug</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="px-3 py-3 border-t border-gray-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <span className="font-semibold">Disconnetti</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-3 py-4 border-t border-gray-800 space-y-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-violet-400 border-2 border-violet-500/50 hover:bg-violet-500/10 font-semibold transition-colors"
                >
                  Accedi
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 shadow-md transition-all"
                >
                  Registrati
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
