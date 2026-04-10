import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Termini e Condizioni</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Accettazione dei Termini</h2>
            <p>
              L'accesso e l'uso del sito web Student sono soggetti all'accettazione e al rispetto dei presenti Termini e Condizioni. Utilizzando il Servizio, l'utente accetta di essere vincolato dai presenti Termini.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descrizione del Servizio</h2>
            <p>
              Student fornisce una piattaforma marketplace che permette agli utenti di inserire annunci per la vendita e l'acquisto di libri usati e appunti, nonché di contattare docenti per servizi di tutoraggio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Registrazione Account</h2>
            <p>
              Per utilizzare alcune funzionalità del Servizio, è necessario registrarsi e creare un account. L'utente è responsabile della riservatezza delle proprie credenziali e di tutte le attività che avvengono sotto il proprio account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Condotta dell'Utente</h2>
            <p>
              L'utente accetta di non utilizzare il Servizio per scopi illegali o proibiti dai presenti Termini. È vietato pubblicare contenuti falsi, fuorvianti, offensivi o che violino i diritti di proprietà intellettuale di terzi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Transazioni tra Utenti</h2>
            <p>
              Student non è coinvolta nelle transazioni effettive tra acquirenti e venditori. Di conseguenza, Student non ha alcun controllo sulla qualità, sicurezza o legalità degli articoli pubblicizzati, sulla veridicità o accuratezza delle inserzioni. L'utente accetta di assumersi tutti i rischi derivanti dall'utilizzo del Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitazione di Responsabilità</h2>
            <p>
              In nessun caso Student sarà responsabile per danni diretti, indiretti, incidentali, speciali o consequenziali derivanti dall'uso o dall'impossibilità di utilizzare il Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare i presenti Termini in qualsiasi momento. La versione più recente dei Termini sarà sempre disponibile sul nostro sito web. Continuando ad accedere o utilizzare il nostro Servizio dopo l'entrata in vigore di tali modifiche, l'utente accetta di essere vincolato dai termini modificati.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
            Ultimo aggiornamento: 26 Marzo 2026
          </div>
        </div>
      </div>
    </div>
  );
};
