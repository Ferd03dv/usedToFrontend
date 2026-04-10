import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12 px-4 md:px-8 xl:px-12 mt-auto">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 mb-10">
          {/* Logo & Vision */}
          <div className="col-span-1 flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 p-2 rounded-lg shadow-lg">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tighter lowercase">Student</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 hidden md:block">
              Il primo hub dedicato interamente alla compravendita di testi scolastici e universitari. La nostra missione è democratizzare lo studio, rendendo i libri accessibili a tutti.
            </p>
            <div className="flex items-center gap-4 mt-auto md:mt-0">
              <a href="#" className="hover:text-violet-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-violet-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-violet-500 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigazione */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-widest">Esplora</h4>
            <ul className="space-y-3.5 md:space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-white transition-colors duration-300">Marketplace</Link>
              </li>
              <li>
                <Link to="/tutors" className="hover:text-white transition-colors duration-300">Cerca Docenti</Link>
              </li>
              <li>
                <Link to="/marketplace/create" className="hover:text-white transition-colors duration-300">Vendi un libro</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-widest">Account</h4>
            <ul className="space-y-3.5 md:space-y-4 text-sm">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors duration-300">Il mio profilo</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors duration-300">I miei preferiti</Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-white transition-colors duration-300">I miei annunci</Link>
              </li>
              <li>
                <Link to="/inbox" className="hover:text-white transition-colors duration-300">Messaggi</Link>
              </li>
            </ul>
          </div>

          {/* Supporto */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-widest">Supporto</h4>
            <ul className="space-y-3.5 md:space-y-4 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-300">Termini e Condizioni</Link>
              </li>
              <li>
                <Link to="/report-bug" className="hover:text-white transition-colors duration-300">Segnala un bug</Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@student.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-center md:text-left">
          <p>© {new Date().getFullYear()} Student. Tutti i diritti riservati.</p>
          <div className="flex flex-wrap justify-center md:items-center gap-4 md:gap-8">
            <span className="flex items-center gap-1">
              Made with <span className="text-rose-500 text-lg leading-none">♥</span> in Italy
            </span>
            <div className="flex items-center gap-4">
              <span>Status: <span className="text-emerald-500">Live</span></span>
              <span>v1.0.4</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
