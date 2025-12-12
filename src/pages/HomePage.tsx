import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  Clock, 
  Star, 
  ChevronDown,
  Send,
  CheckCircle,
  Coffee,
  Camera,
  Utensils
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  const faqItems = [
    {
      question: "Quanto costa utilizzare ItinerAI?",
      answer: "ItinerAI offre 3 itinerari gratuiti per i nuovi utenti. Successivamente, puoi scegliere tra diversi piani di abbonamento mensili o annuali per continuare a creare itinerari personalizzati."
    },
    {
      question: "Posso modificare l'itinerario generato?",
      answer: "Assolutamente sì! Puoi personalizzare ogni aspetto dell'itinerario: aggiungere o rimuovere attività, modificare gli orari, cambiare ristoranti o alloggi. L'AI apprenderà dalle tue modifiche per migliorare le prossime proposte."
    },
    {
      question: "È adatto per viaggi con bambini?",
      answer: "Perfettamente! ItinerAI tiene conto delle esigenze speciali come viaggi con bambini, accessibilità per disabili, e preferenze alimentari. Basta indicarlo nel form di creazione."
    },
    {
      question: "Quanto tempo ci vuole per generare un itinerario?",
      answer: "La generazione di un itinerario personalizzato richiede solitamente 2-3 minuti. Il nostro AI analizza migliaia di opzioni per creare le proposte perfette per te."
    },
    {
      question: "Posso fidarmi delle raccomandazioni AI?",
      answer: "Il nostro AI è addestrato con dati aggiornati su migliaia di destinazioni, attività, ristoranti e alloggi. Le raccomandazioni sono basate su recensioni reali e preferenze di viaggiatori simili a te."
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Il tuo viaggio perfetto
              <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent"> in pochi minuti</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Lascia che l'intelligenza artificiale crei il tuo itinerario personalizzato. 
              Voli, alloggi, esperienze e ristoranti ottimizzati per te.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/create">
                <Button variant="primary" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Crea il tuo itinerario
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Scopri di più
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center" hover>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Destinazioni illimitate</h3>
                <p className="text-neutral-600">Qualsiasi città o paese nel mondo, il nostro AI conosce tutto</p>
              </CardContent>
            </Card>

            <Card className="text-center" hover>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Risparmia tempo</h3>
                <p className="text-neutral-600">Niente più ore di ricerca online, ottieni 3 proposte complete</p>
              </CardContent>
            </Card>

            <Card className="text-center" hover>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Personalizzato al 100%</h3>
                <p className="text-neutral-600">Basato sui tuoi interessi, budget e stile di viaggio</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Come funziona</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Quattro semplici passi per ottenere il tuo itinerario perfetto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Inserisci i dati</h3>
              <p className="text-neutral-600">Destinazione, date, numero di viaggiatori e preferenze di base</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Definisci lo stile</h3>
              <p className="text-neutral-600">Budget, ritmo del viaggio e interessi specifici</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">L'AI costruisce</h3>
              <p className="text-neutral-600">Il nostro AI elabora migliaia di combinazioni per creare 2-3 proposte</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Tu scegli</h3>
              <p className="text-neutral-600">Seleziona l'itinerario preferito e personalizzalo se necessario</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why ItinerAI Section */}
      <section id="why-itinerai" className="py-16 px-4 bg-neutral-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Perché scegliere ItinerAI?</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Confronta i metodi tradizionali di pianificazione viaggi
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Caratteristica</th>
                    <th className="px-6 py-4 text-center font-semibold">Viaggio senza AI</th>
                    <th className="px-6 py-4 text-center font-semibold">Agenzia classica</th>
                    <th className="px-6 py-4 text-center font-semibold bg-accent">ItinerAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-primary">Tempo di pianificazione</td>
                    <td className="px-6 py-4 text-center text-neutral-600">15-20 ore</td>
                    <td className="px-6 py-4 text-center text-neutral-600">2-3 giorni</td>
                    <td className="px-6 py-4 text-center bg-accent/10 text-accent font-semibold">2-3 minuti</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-primary">Personalizzazione</td>
                    <td className="px-6 py-4 text-center text-neutral-600">Limitata</td>
                    <td className="px-6 py-4 text-center text-neutral-600">Standard</td>
                    <td className="px-6 py-4 text-center bg-accent/10 text-accent font-semibold">Totale</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-primary">Costo</td>
                    <td className="px-6 py-4 text-center text-neutral-600">Variabile</td>
                    <td className="px-6 py-4 text-center text-neutral-600">€50-200</td>
                    <td className="px-6 py-4 text-center bg-accent/10 text-accent font-semibold">A partire da €9</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-primary">Copertura destinazioni</td>
                    <td className="px-6 py-4 text-center text-neutral-600">Limitata</td>
                    <td className="px-6 py-4 text-center text-neutral-600">Buona</td>
                    <td className="px-6 py-4 text-center bg-accent/10 text-accent font-semibold">Mondiale</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-primary">Aggiornamenti in tempo reale</td>
                    <td className="px-6 py-4 text-center text-neutral-600">❌</td>
                    <td className="px-6 py-4 text-center text-neutral-600">❌</td>
                    <td className="px-6 py-4 text-center bg-accent/10 text-accent font-semibold">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Example Itinerary Section */}
      <section id="example" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Esempio di itinerario</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Ecco cosa può creare ItinerAI per te - 3 giorni a Roma
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Roma Classica - 3 Giorni</CardTitle>
                <p className="text-neutral-600">Itinerario culturale con i must della Città Eterna</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Day 1 */}
                  <div className="border-l-4 border-accent pl-6">
                    <h3 className="text-xl font-semibold text-primary mb-4">Giorno 1 - Il cuore antico di Roma</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          09:00 - Colosseo
                        </h4>
                        <p className="text-neutral-600 mb-2">Visita guidata dell'anfiteatro più famoso del mondo (2 ore)</p>
                        <p className="text-sm text-neutral-500">Prenotazione consigliata online</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          12:30 - Fori Romani
                        </h4>
                        <p className="text-neutral-600 mb-2">Passeggia tra le rovine dell'antica Roma</p>
                        <p className="text-sm text-neutral-500">Biglietto combinato con Colosseo</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Coffee className="w-4 h-4 mr-2" />
                          15:00 - Pausa caffè
                        </h4>
                        <p className="text-neutral-600 mb-2">Caffè Sant'Eustachio - autentico caffè romano</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Utensils className="w-4 h-4 mr-2" />
                          19:30 - Cena
                        </h4>
                        <p className="text-neutral-600 mb-2">Da Enzo al 29 - cucina romana tradizionale</p>
                        <p className="text-sm text-neutral-500">Prenotazione consigliata</p>
                      </div>
                    </div>
                  </div>

                  {/* Day 2 */}
                  <div className="border-l-4 border-secondary pl-6">
                    <h3 className="text-xl font-semibold text-primary mb-4">Giorno 2 - Vaticano e Rinascimento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          08:00 - Musei Vaticani
                        </h4>
                        <p className="text-neutral-600 mb-2">Cappella Sistina e collezioni papali (3 ore)</p>
                        <p className="text-sm text-neutral-500">Prenotazione obbligatoria</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          12:00 - Basilica di San Pietro
                        </h4>
                        <p className="text-neutral-600 mb-2">Visita alla basilica e cupola</p>
                        <p className="text-sm text-neutral-500">Ingresso gratuito, cupola a pagamento</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Camera className="w-4 h-4 mr-2" />
                          16:00 - Castel Sant'Angelo
                        </h4>
                        <p className="text-neutral-600 mb-2">Fortezza papale con vista panoramica</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Utensils className="w-4 h-4 mr-2" />
                          20:00 - Cena
                        </h4>
                        <p className="text-neutral-600 mb-2">Il Sorpasso - pesce fresco e cucina creativa</p>
                      </div>
                    </div>
                  </div>

                  {/* Day 3 */}
                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold text-primary mb-4">Giorno 3 - Barocco e Dolce Vita</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          10:00 - Fontana di Trevi
                        </h4>
                        <p className="text-neutral-600 mb-2">Il monumento barocco più famoso</p>
                        <p className="text-sm text-neutral-500">Migliore la mattina presto</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          11:00 - Piazza di Spagna
                        </h4>
                        <p className="text-neutral-600 mb-2">Scalinata di Trinità dei Monti</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          12:30 - Pantheon
                        </h4>
                        <p className="text-neutral-600 mb-2">Il tempio romano meglio conservato</p>
                        <p className="text-sm text-neutral-500">Ingresso gratuito</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <Coffee className="w-4 h-4 mr-2" />
                          15:00 - Aperitivo
                        </h4>
                        <p className="text-neutral-600 mb-2">Caffè Greco - storico caffè letterario</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                    Note dell'AI
                  </h4>
                  <ul className="text-neutral-600 space-y-1">
                    <li>• Distanze percorribili a piedi tra le attrazioni</li>
                    <li>• Orari ottimizzati per evitare le folle</li>
                    <li>• Ristoranti selezionati per qualità e autenticità</li>
                    <li>• Budget stimato: €150-200 a persona al giorno</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-neutral-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Domande frequenti</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Tutto quello che vuoi sapere su ItinerAI
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-primary">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-neutral-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Newsletter Section */}
      <section id="contact" className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto per il tuo prossimo viaggio?</h2>
            <p className="text-xl text-neutral-200 mb-8">
              Iscriviti alla nostra newsletter e ricevi suggerimenti di viaggio esclusivi e offerte speciali
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-light border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                <Button type="submit" variant="primary" size="md">
                  <Send className="w-4 h-4 mr-2" />
                  Iscriviti
                </Button>
              </div>
            </form>

            <div className="mt-12">
              <Link to="/create">
                <Button variant="primary" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Inizia a pianificare il tuo viaggio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
