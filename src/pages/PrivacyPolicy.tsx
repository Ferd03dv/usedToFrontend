import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Raccolta delle informazioni</h2>
            <p>
              Student raccoglie informazioni quando ti registri sul nostro sito, effettui l'accesso al tuo account, vendi o acquisti un libro. Le informazioni raccolte includono il tuo nome, indirizzo email, numero di telefono e foto del profilo se caricate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Uso delle informazioni</h2>
            <p>
              Qualsiasi informazione che raccogliamo da te può essere utilizzata per:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personalizzare la tua esperienza e rispondere alle tue esigenze individuali</li>
              <li>Fornire contenuti pubblicitari personalizzati</li>
              <li>Migliorare il nostro sito web</li>
              <li>Migliorare il servizio clienti e le vostre esigenze di supporto</li>
              <li>Contattarti tramite email o notifiche all'interno della piattaforma</li>
              <li>Gestire un annuncio o un'attività sul marketplace</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Privacy dell'e-commerce</h2>
            <p>
              Siamo gli unici proprietari delle informazioni raccolte su questo sito. Le tue informazioni personali non saranno vendute, scambiate, trasferite o date a qualsiasi altra società per qualsiasi motivo, senza il tuo consenso, oltre a quanto necessario per soddisfare una richiesta e/o transazione, ad esempio per l'invio di un ordine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Divulgazione a terzi</h2>
            <p>
              Non vendiamo, scambiamo o trasferiamo in altro modo a terzi le tue informazioni personali identificabili. Questo non include terze parti fidate che ci aiutano a gestire il nostro sito web o a condurre la nostra attività, a condizione che tali parti accettino di mantenere queste informazioni riservate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Protezione delle informazioni</h2>
            <p>
              Implementiamo una varietà di misure di sicurezza per mantenere la sicurezza delle tue informazioni personali. Utilizziamo una crittografia all'avanguardia per proteggere le informazioni sensibili trasmesse online. Proteggiamo anche le tue informazioni fuori riga.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
            <p>
              I nostri cookies migliorano l'accesso al nostro sito e identificano i visitatori abituali. Inoltre, i nostri cookies migliorano l'esperienza dell'utente tracciando e mirando ai suoi interessi. Tuttavia, questo uso di cookies non è in alcun modo collegato ad alcuna informazione personale identificabile sul nostro sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Consenso</h2>
            <p>
              Utilizzando il nostro sito, acconsenti alla nostra politica sulla privacy.
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
