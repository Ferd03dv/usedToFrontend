export const narrativeCategories = [
  'Romanzo Contemporaneo', 'Narrativa Classica & Letteratura', 'Romanzo Storico',
  'Giallo & Mistero', 'Thriller & Suspense', 'Noir & Hardboiled',
  'Fantascienza & Distopia', 'Fantasy & Realismo Magico', 'Horror & Gotico',
  'Romance & Sentimentale', 'Avventura & Azione', 'Young Adult & Narrativa per Ragazzi'
];

export const logicCategories = [
  'Biografie & Memorie', 'Sviluppo Personale & Self-Help', 'Economia, Business & Finanza',
  'Psicologia & Sociologia', 'Filosofia', 'Storia & Attualità',
  'Politica & Diritto', 'Scienze & Divulgazione', 'Viaggi & Esplorazione'
];

export const otherCategories = [
  'Fumetti', 'Manga', 'Arte, Architettura & Fotografia',
  'Religione & Spiritualità', 'Cucina & Enogastronomia', 'Poesia & Teatro',
  'Musica & Spettacolo', 'Sport & Tempo Libero'
];

// Re-defining for correct string values if needed elsewhere
export const categoryGroups = {
  narrativa: narrativeCategories,
  saggistica: logicCategories,
  passioni: otherCategories
};

export const categoryDescriptions: Record<string, string> = {
  // Narrativa & Letteratura
  'Romanzo Contemporaneo': 'Opere di narrativa scritte in epoca recente, che esplorano temi e stili attuali.',
  'Narrativa Classica & Letteratura': 'I grandi capolavori della letteratura di ogni tempo, dai classici greci ai maestri del Novecento.',
  'Romanzo Storico': 'Romanzi ambientati in periodi storici passati, con ricostruzioni dettagliate di epoche e atmosfere.',
  'Giallo & Mistero': 'Storie incentrate sulla risoluzione di un crimine o di un enigma inquietante.',
  'Thriller & Suspense': 'Narrazioni ad alta tensione che tengono il lettore col fiato sospeso fino all\'ultima pagina.',
  'Noir & Hardboiled': 'Sottogeneri del giallo caratterizzati da atmosfere cupe, cinismo e realismo crudo.',
  'Fantascienza & Distopia': 'Esplorazioni di mondi futuri, tecnologie avanzate o società oppressive e futuristiche.',
  'Fantasy & Realismo Magico': 'Viaggi in mondi immaginari popolati da creature magiche o realtà quotidiane permeate dal soprannaturale.',
  'Horror & Gotico': 'Storie che esplorano la paura, l\'ignoto e il soprannaturale in atmosfere inquietanti.',
  'Romance & Sentimentale': 'Narrazioni incentrate sulle relazioni amorose e sul mondo dei sentimenti.',
  'Avventura & Azione': 'Storie dinamiche piene di sfide, viaggi perigliosi e imprese eroiche.',
  'Young Adult & Narrativa per Ragazzi': 'Libri dedicati alla fascia d\'età adolescenziale e ai giovani lettori.',

  // Saggistica, Business & Crescita
  'Biografie & Memorie': 'Racconti di vite reali, autobiografie e cronache di personaggi illustri o comuni.',
  'Sviluppo Personale & Self-Help': 'Guide e saggi dedicati alla crescita interiore e al miglioramento delle proprie potenzialità.',
  'Economia, Business & Finanza': 'Testi che approfondiscono il mondo dei mercati, del management e della gestione finanziaria.',
  'Psicologia & Sociologia': 'Studi sulla mente umana, sul comportamento e sulla struttura delle società.',
  'Filosofia': 'Opere che interrogano il senso dell\'esistenza, l\'etica e i grandi sistemi di pensiero.',
  'Storia & Attualità': 'Analisi del passato per comprendere il presente e i principali eventi contemporanei.',
  'Politica & Diritto': 'Riflessioni sui sistemi di governo, le leggi e le dinamiche del potere.',
  'Scienze & Divulgazione': 'Libri che rendono accessibili i grandi temi della fisica, biologia, astronomia e molto altro.',
  'Viaggi & Esplorazione': 'Cronache di viaggiatori e guide per scoprire i luoghi più remoti o affascinanti del pianeta.',

  // Fumetti, Arti & Passioni
  'Fumetti': 'L\'arte sequenziale in tutte le sue forme, dalle strisce ai romanzi grafici d\'autore.',
  'Manga': 'Il mondo del fumetto giapponese e coreano, con i suoi generi e stili inconfondibili.',
  'Arte, Architettura & Fotografia': 'Monografie e saggi sulle arti visive, il design e la bellezza delle forme.',
  'Religione & Spiritualità': 'Testi sacri, studi teologici e percorsi di ricerca interiore e trascendente.',
  'Cucina & Enogastronomia': 'Ricettari, saggi sul cibo e guide alla scoperta dei sapori e delle tradizioni a tavola.',
  'Poesia & Teatro': "La forza dei versi e la magia della drammaturgia in un'unica categoria letteraria.",
  'Musica & Spettacolo': 'Storie di artisti, analisi musicali e il dietro le quinte del mondo del cinema e del teatro.',
  'Sport & Tempo Libero': 'Racconti di imprese sportive, manuali e libri dedicati agli hobby e al relax.'
};
