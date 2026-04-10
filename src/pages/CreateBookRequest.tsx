import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBookRequest } from '../hooks/useMarketplace';
import { BookCategory, BookCondition } from '../types/marketplace';
import { Book } from 'lucide-react';
import {
  narrativeCategories,
  logicCategories,
  otherCategories
} from '../constants/categories';

export const CreateBookRequest: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createRequest, isPending } = useCreateBookRequest();

  const [bookType, setBookType] = useState<'scolastico' | 'non_scolastico'>('scolastico');
  const [formData, setFormData] = useState({
    title: '',
    category: BookCategory.UNIVERSITA,
    subject: '',
    author: '',
    publisher: '',
    isbn: '',
    condition: BookCondition.BUONO,
    minPrice: '',
    maxPrice: '',
    description: ''
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategory = formData.category as string;
    let finalSubject: string | undefined = formData.subject;

    if (bookType === 'non_scolastico') {
      finalCategory = formData.subject; // Il campo subject nel form agisce come menù a tendina per il genere se è non_scolastico
      finalSubject = undefined;
    } else {
      if (!finalSubject || finalSubject.trim() === '') {
        finalSubject = undefined;
      }
    }

    const payload: Record<string, any> = {
      category: finalCategory,
      publisher: formData.publisher,
      condition: formData.condition,
      description: formData.description
    };

    if (finalSubject) payload.subject = finalSubject;

    if (formData.title) payload.title = formData.title;
    if (formData.author) payload.author = formData.author;
    if (formData.isbn) payload.isbn = formData.isbn;
    if (formData.minPrice) payload.min_price = parseFloat(formData.minPrice);
    if (formData.maxPrice) payload.max_price = parseFloat(formData.maxPrice);

    createRequest(payload as any, {
      onSuccess: () => navigate('/my-requests')
    });
  };


  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 xl:px-12 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Trova Libro</h1>
        <p className="text-gray-400 mt-2">Crea una richiesta per un libro che non trovi. Verrai notificato quando qualcuno lo metterà in vendita.</p>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-4">
          <Book className="w-6 h-6 text-violet-500" />
          <h2 className="text-xl font-bold text-white">Dettagli del Libro Ricercato</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Titolo del Libro</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                placeholder="es. Fondamenti di Fisica Generale"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Tipo di Libro</label>
              <select
                required
                value={bookType}
                onChange={e => {
                  const val = e.target.value as 'scolastico' | 'non_scolastico';
                  setBookType(val);
                  if (val === 'non_scolastico') {
                    setFormData(prev => ({ ...prev, subject: 'Romanzo Contemporaneo' }));
                  } else {
                    setFormData(prev => ({ ...prev, subject: '' }));
                  }
                }}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              >
                <option value="scolastico">Scolastico / Universitario</option>
                <option value="non_scolastico">Varia (Romanzi, Saggi, ecc.)</option>
              </select>
            </div>

            {bookType === 'scolastico' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">Materia / Genere</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                    placeholder="es. Fisica"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">Livello Accademico</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as BookCategory })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                  >
                    <option value={BookCategory.SCUOLE_MEDIE}>Scuole Medie</option>
                    <option value={BookCategory.SCUOLE_SUPERIORI}>Scuole Superiori</option>
                    <option value={BookCategory.UNIVERSITA}>Università</option>
                    <option value={BookCategory.CONCORSI}>Concorsi</option>
                  </select>
                </div>
              </>
            )}

            {bookType === 'non_scolastico' && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">Categoria / Genere</label>
                <select
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                >
                  <optgroup label="Narrativa & Letteratura">
                    {narrativeCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Saggistica, Business & Crescita">
                    {logicCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Fumetti, Arti & Passioni">
                    {otherCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Autore</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                placeholder="es. Italo Calvino"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Casa Editrice (Obbligatorio)</label>
              <input
                type="text"
                required
                value={formData.publisher}
                onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                placeholder="es. Mondadori"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">ISBN</label>
              <input
                type="text"
                required
                value={formData.isbn}
                onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                placeholder="es. 9788804668237"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Condizioni Accettate (Minime)</label>
              <select
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value as BookCondition })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              >
                {Object.values(BookCondition).map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Prezzo Disposto a Pagare (€)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.minPrice}
                  onChange={e => setFormData({ ...formData, minPrice: e.target.value })}
                  className="w-1/2 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm font-bold text-violet-400 placeholder-gray-500"
                  placeholder="Min (es. 10)"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.maxPrice}
                  onChange={e => setFormData({ ...formData, maxPrice: e.target.value })}
                  className="w-1/2 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm font-bold text-violet-400 placeholder-gray-500"
                  placeholder="Max (es. 30)"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Note o Descrizione</label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm min-h-[100px] placeholder-gray-500"
                placeholder="Aggiungi dettagli extra (es. Assenza sottolineature, Edizione specifica...)"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 rounded-xl font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-sm transition-all focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              Invia Richiesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
