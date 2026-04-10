import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploadZone } from '../components/marketplace/ImageUploadZone';
import { useCreateBook, useCreateNote } from '../hooks/useMarketplace';
import { BookCategory, BookCondition } from '../types/marketplace';
import { Book, FileText } from 'lucide-react';
import {
  narrativeCategories,
  logicCategories,
  otherCategories
} from '../constants/categories';

export const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'book' | 'note'>('book');
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const { mutate: createBook, isPending: isCreatingBook } = useCreateBook();
  const { mutate: createNote, isPending: isCreatingNote } = useCreateNote();

  const [bookType, setBookType] = useState<'scolastico' | 'non_scolastico' | ''>('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: BookCategory.UNIVERSITA,
    subject: '',
    author: '',
    publisher: '',
    isbn: '',
    condition: BookCondition.BUONO,
    description: '',
    // Specific for notes
    pagesCount: '',
    creationYear: new Date().getFullYear().toString()
  });

  const isPending = isCreatingBook || isCreatingNote;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (listingType === 'book') {
      const actualCategory = bookType === 'non_scolastico' ? formData.subject : formData.category;

      createBook({
        title: formData.title,
        price: parseFloat(formData.price),
        category: actualCategory as any,
        subject: formData.subject,
        author: formData.author,
        publisher: formData.publisher,
        isbn: formData.isbn,
        condition: formData.condition,
        description: formData.description,
        image_paths: imagePaths
      }, {
        onSuccess: () => navigate('/marketplace')
      });
    } else {
      createNote({
        title: formData.title,
        price: parseFloat(formData.price),
        academic_level: formData.category,
        subject: formData.subject,
        description: formData.description,
        pages_count: parseInt(formData.pagesCount, 10),
        creation_year: parseInt(formData.creationYear, 10),
        image_preview_paths: imagePaths
      }, {
        onSuccess: () => navigate('/marketplace')
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 xl:px-12 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Vendi un articolo</h1>
        <p className="text-gray-400 mt-2">Crea un nuovo annuncio per vendere i tuoi libri o appunti.</p>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-6 sm:p-8">

        {/* Type Selector */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => setListingType('book')}
            className={`flex-1 flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all ${listingType === 'book' ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-300'
              }`}
          >
            <Book className="w-8 h-8 mb-2" />
            <span className="font-semibold">Libro Usato</span>
          </button>

          <button
            type="button"
            onClick={() => setListingType('note')}
            className={`flex-1 flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all ${listingType === 'note' ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-300'
              }`}
          >
            <FileText className="w-8 h-8 mb-2" />
            <span className="font-semibold">Appunti</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tipo di Libro (only if it's a book) */}
            {listingType === 'book' && (
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
                  <option value="" disabled>Seleziona la tipologia</option>
                  <option value="scolastico">Scolastico / Universitario</option>
                  <option value="non_scolastico">Varia (Romanzi, Saggi, ecc.)</option>
                </select>
              </div>
            )}

            {(listingType === 'note' || (listingType === 'book' && bookType !== '')) && (
              <>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300">Titolo dell'annuncio</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-500"
                    placeholder={listingType === 'book' ? "es. Fondamenti di Fisica Generale" : "es. Appunti di Analisi 1 (Prof. Rossi)"}
                  />
                </div>

                {/* Livello Accademico e Materia / Genere */}
                {(listingType === 'note' || (listingType === 'book' && bookType === 'scolastico')) && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-300">
                        {listingType === 'note' ? 'Materia' : 'Materia / Genere'}
                      </label>
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

                {/* Categoria per Non Scolastico */}
                {listingType === 'book' && bookType === 'non_scolastico' && (
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-300">Categoria</label>
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

                {/* Campi comuni Libro */}
                {listingType === 'book' && (
                  <>
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
                      <label className="text-sm font-semibold text-gray-300">Casa Editrice</label>
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
                  </>
                )}

                {listingType === 'book' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-300">Condizione</label>
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
                )}

                {listingType === 'note' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-300">Numero di pagine</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.pagesCount}
                        onChange={e => setFormData({ ...formData, pagesCount: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-300">Anno di creazione</label>
                      <input
                        type="number"
                        required
                        min="2000"
                        max={new Date().getFullYear()}
                        value={formData.creationYear}
                        onChange={e => setFormData({ ...formData, creationYear: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-300">Prezzo (€)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm font-bold text-violet-400 placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300">Descrizione (opzionale)</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white outline-none focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm min-h-[100px] placeholder-gray-500"
                    placeholder="Aggiungi dettagli sulle condizioni, edizione, professore ecc..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">
                    {listingType === 'book' ? "Foto del libro (max 5)" : "Anteprima appunti (max 5)"}
                  </label>
                  <ImageUploadZone
                    onUploadSuccess={(paths) => setImagePaths(prev => [...prev, ...paths])}
                    maxFiles={5}
                  />
                </div>
              </>
            )}
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
              Pubblica Annuncio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
