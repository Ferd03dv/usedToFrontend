export enum BookCondition {
  NUOVO = 'Nuovo',
  COME_NUOVO = 'Come Nuovo',
  BUONO = 'Buono',
  ACCETTABILE = 'Accettabile',
  PESSIMO = 'Pessimo'
}

export enum ListingStatus {
  DISPONIBILE = 'Disponibile',
  IN_TRATTATIVA = 'In Trattativa',
  VENDUTO = 'Venduto',
  NASCOSTO = 'Nascosto',
  SCADUTO = 'Scaduto'
}

export enum BookCategory {
  SCUOLE_MEDIE = 'Scuole Medie',
  SCUOLE_SUPERIORI = 'Scuole Superiori',
  UNIVERSITA = 'Università',
  CONCORSI = 'Concorsi',
  NARRATIVA = 'Narrativa',
  SAGGISTICA = 'Saggistica',
  ALTRO = 'Altro'
}

export enum NonScholasticGenre {
  // Narrativa & Letteratura
  ROMANZO_CONTEMPORANEO = 'Romanzo Contemporaneo',
  NARRATIVA_CLASSICA = 'Narrativa Classica & Letteratura',
  ROMANZO_STORICO = 'Romanzo Storico',
  GIALLO_MISTERO = 'Giallo & Mistero',
  THRILLER_SUSPENSE = 'Thriller & Suspense',
  NOIR_HARDBOILED = 'Noir & Hardboiled',
  FANTASCIENZA_DISTOPIA = 'Fantascienza & Distopia',
  FANTASY_REALISMO_MAGICO = 'Fantasy & Realismo Magico',
  HORROR_GOTICO = 'Horror & Gotico',
  ROMANCE_SENTIMENTALE = 'Romance & Sentimentale',
  AVVENTURA_AZIONE = 'Avventura & Azione',
  YOUNG_ADULT = 'Young Adult & Narrativa per Ragazzi',

  // Saggistica, Business & Crescita
  BIOGRAFIE_MEMORIE = 'Biografie & Memorie',
  SVILUPPO_PERSONALE = 'Sviluppo Personale & Self-Help',
  ECONOMIA_BUSINESS = 'Economia, Business & Finanza',
  PSICOLOGIA_SOCIOLOGIA = 'Psicologia & Sociologia',
  FILOSOFIA = 'Filosofia',
  STORIA_ATTUALITA = 'Storia & Attualità',
  POLITICA_DIRITTO = 'Politica & Diritto',
  SCIENZE_DIVULGAZIONE = 'Scienze & Divulgazione',
  VIAGGI_ESPLORAZIONE = 'Viaggi & Esplorazione',

  // Fumetti, Arti & Passioni
  FUMETTI_GRAPHIC_NOVEL = 'Fumetti & Graphic Novel',
  MANGA_MANHWA = 'Manga & Manhwa',
  ARTE_ARCHITETTURA = 'Arte, Architettura & Fotografia',
  RELIGIONE_SPIRITUALITA = 'Religione & Spiritualità',
  CUCINA_ENOGASTRONOMIA = 'Cucina & Enogastronomia',
  POESIA_TEATRO = 'Poesia & Teatro',
  MUSICA_SPETTACOLO = 'Musica & Spettacolo',
  SPORT_TEMPO_LIBERO = 'Sport & Tempo Libero',
  ALTRO = 'Altro'
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    meta: PaginationMeta;
  };
}

export interface BookListing {
  id: string;
  seller_id: string;
  category: BookCategory;
  title: string;
  subject: string;
  author?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  description?: string | null;
  condition: BookCondition;
  price: number;
  image_paths: string[];
  status: ListingStatus;
  created_at: string;
  expires_at: string;
  updated_at: string;
  seller?: {
    id?: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    average_rating: number;
  };
}

export interface StudyNote {
  id: string;
  uploader_id: string;
  title: string;
  description?: string | null;
  pages_count: number;
  academic_level: BookCategory;
  subject: string;
  creation_year: number;
  price: number;
  file_paths: string[];
  image_preview_paths: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookRequest {
  id: string;
  user_id: string;
  category: string;
  title?: string | null;
  subject?: string | null;
  author?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  condition?: string | null;
  description?: string | null;
  status: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  book_id?: string | null;
  note_id?: string | null;
  created_at: string;
  book?: BookListing;
  note?: StudyNote;
}

export interface CreateBookPayload {
  category: BookCategory;
  title: string;
  subject: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  description?: string;
  condition: BookCondition;
  price: number;
  image_paths?: string[];
}

export interface CreateNotePayload {
  title: string;
  description?: string;
  pages_count: number;
  academic_level: BookCategory;
  subject: string;
  creation_year: number;
  price: number;
  file_paths?: string[];
  image_preview_paths?: string[];
}

export interface CreateBookRequestPayload {
  category: string;
  title?: string;
  subject?: string;  // campo corretto per l'API
  author?: string;
  publisher: string;
  isbn?: string;
  min_price?: number;
  max_price?: number;
  condition: BookCondition;
  description: string;
}
