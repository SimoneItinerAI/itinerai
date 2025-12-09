import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Wallet, Gauge, Heart, X, Sparkles, CheckCircle2, Plane } from 'lucide-react';

interface CreateItineraryProps {
  onBack: () => void;
}

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: string;
  travelersType: string;
  budget: string;
  pace: string;
  interests: string[];
  notes: string;
  hasKids: boolean;
  hasReducedMobility: boolean;
  hasAccommodation: boolean;
  accommodationAddress: string;
  hasTransport: boolean;
  transportDetails: string;
}

const CreateItinerary = ({ onBack }: CreateItineraryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    travelersCount: '2',
    travelersType: 'coppia',
    budget: 'medio',
    pace: 'equilibrato',
    interests: [],
    notes: '',
    hasKids: false,
    hasReducedMobility: false,
    hasAccommodation: false,
    accommodationAddress: '',
    hasTransport: false,
    transportDetails: ''
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const steps = [
      "Analizzo le tue preferenze",
      "Seleziono le migliori combinazioni",
      "Organizzo il viaggio giorno per giorno"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setGenerationStep(currentStep);
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationStep(0);
        }, 1000);
      }
    }, 1500);
  };

  const interestOptions = [
    { id: 'cultura', label: 'Cultura e musei', icon: '🏛️' },
    { id: 'cibo', label: 'Cibo e ristoranti', icon: '🍝' },
    { id: 'natura', label: 'Natura e paesaggi', icon: '🌲' },
    { id: 'nightlife', label: 'Vita notturna', icon: '🎉' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'relax', label: 'Relax e benessere', icon: '🧘' }
  ];

  const generationSteps = [
    "Analizzo le tue preferenze",
    "Seleziono le migliori combinazioni",
    "Organizzo il viaggio giorno per giorno"
  ];

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF8A3D] to-[#E67628] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-[#1A2B4C] mb-4">
              Sto costruendo il tuo itinerario
            </h2>
            <p className="text-lg text-[#5B6473] mb-8">
              Tranquillo, stiamo togliendo noi il peso dell'organizzazione
            </p>

            <div className="space-y-4 mb-8">
              {generationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index < generationStep
                      ? 'bg-green-50 border-2 border-green-200'
                      : index === generationStep
                      ? 'bg-orange-50 border-2 border-[#FF8A3D]'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {index < generationStep ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : index === generationStep ? (
                    <div className="w-6 h-6 border-4 border-[#FF8A3D] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 border-4 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span
                    className={`font-medium ${
                      index <= generationStep ? 'text-[#1A2B4C]' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF8A3D] to-[#E67628] h-full rounded-full transition-all duration-500"
                style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#2F80ED] hover:text-[#1A2B4C] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Torna alla home</span>
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-[#5B6473]">Crea itinerario</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="ItinerAI Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-[#1A2B4C]">ItinerAI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h1 className="text-3xl font-bold text-[#1A2B4C] mb-2">
                Crea il tuo itinerario
              </h1>
              <p className="text-[#5B6473] mb-8">
                Compila i campi qui sotto e lascia che l'AI organizzi tutto per te
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1A2B4C] pb-2 border-b-2 border-[#FF8A3D]">
                    1. Informazioni di base
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                      Destinazione
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2F80ED]" />
                      <input
                        type="text"
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="Es. Roma, Lisbona, Tokyo..."
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                        Data di partenza
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2F80ED]" />
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                        Data di ritorno
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2F80ED]" />
                        <input
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                        Numero di viaggiatori
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2F80ED]" />
                        <select
                          value={formData.travelersCount}
                          onChange={(e) => setFormData({ ...formData, travelersCount: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors appearance-none bg-white"
                        >
                          <option value="1">1 persona</option>
                          <option value="2">2 persone</option>
                          <option value="3-4">3-4 persone</option>
                          <option value="5+">5+ persone</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                        Tipo di viaggiatori
                      </label>
                      <select
                        value={formData.travelersType}
                        onChange={(e) => setFormData({ ...formData, travelersType: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors appearance-none bg-white"
                      >
                        <option value="solo">Solo</option>
                        <option value="coppia">Coppia</option>
                        <option value="famiglia">Famiglia</option>
                        <option value="amici">Amici</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1A2B4C] pb-2 border-b-2 border-[#FF8A3D]">
                    2. Stile di viaggio
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-3">
                      Budget indicativo
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['economico', 'medio', 'comfort'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: option })}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            formData.budget === option
                              ? 'border-[#FF8A3D] bg-orange-50 text-[#1A2B4C]'
                              : 'border-gray-200 hover:border-[#2F80ED] text-[#5B6473]'
                          }`}
                        >
                          {option === 'economico' && '💰 Economico'}
                          {option === 'medio' && '💳 Medio'}
                          {option === 'comfort' && '✨ Comfort'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-3">
                      Ritmo del viaggio
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'tranquillo', label: 'Molto tranquillo', icon: '🐢' },
                        { value: 'equilibrato', label: 'Equilibrato', icon: '⚖️' },
                        { value: 'intenso', label: 'Intenso', icon: '🚀' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, pace: option.value })}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            formData.pace === option.value
                              ? 'border-[#FF8A3D] bg-orange-50 text-[#1A2B4C]'
                              : 'border-gray-200 hover:border-[#2F80ED] text-[#5B6473]'
                          }`}
                        >
                          {option.icon} {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-3">
                      Interessi (seleziona uno o più)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleInterestToggle(option.id)}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-left ${
                            formData.interests.includes(option.id)
                              ? 'border-[#FF8A3D] bg-orange-50 text-[#1A2B4C]'
                              : 'border-gray-200 hover:border-[#2F80ED] text-[#5B6473]'
                          }`}
                        >
                          <span className="text-xl mr-2">{option.icon}</span>
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1A2B4C] pb-2 border-b-2 border-[#FF8A3D]">
                    3. Preferenze e vincoli
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                      Cosa è importante per te in questo viaggio?
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Es. niente sveglie all'alba, voglio evitare luoghi troppo affollati, ho già prenotato l'hotel..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors resize-none"
                    />
                    <p className="text-sm text-[#5B6473] mt-2">Questo campo è opzionale ma ci aiuta a personalizzare meglio il tuo viaggio</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#1A2B4C] mb-2">
                      Vincoli particolari
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2F80ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasKids}
                        onChange={(e) => setFormData({ ...formData, hasKids: e.target.checked })}
                        className="w-5 h-5 text-[#FF8A3D] rounded focus:ring-[#2F80ED]"
                      />
                      <span className="text-[#1A2B4C]">Viaggio con bambini piccoli</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2F80ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasReducedMobility}
                        onChange={(e) => setFormData({ ...formData, hasReducedMobility: e.target.checked })}
                        className="w-5 h-5 text-[#FF8A3D] rounded focus:ring-[#2F80ED]"
                      />
                      <span className="text-[#1A2B4C]">Mobilità ridotta</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2F80ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasAccommodation}
                        onChange={(e) => setFormData({ ...formData, hasAccommodation: e.target.checked })}
                        className="w-5 h-5 text-[#FF8A3D] rounded focus:ring-[#2F80ED]"
                      />
                      <span className="text-[#1A2B4C]">Ho già prenotato l'alloggio</span>
                    </label>

                    {formData.hasAccommodation && (
                      <div className="ml-8">
                        <input
                          type="text"
                          value={formData.accommodationAddress}
                          onChange={(e) => setFormData({ ...formData, accommodationAddress: e.target.value })}
                          placeholder="Indirizzo dell'alloggio (per ottimizzare le distanze)"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2F80ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasTransport}
                        onChange={(e) => setFormData({ ...formData, hasTransport: e.target.checked })}
                        className="w-5 h-5 text-[#FF8A3D] rounded focus:ring-[#2F80ED]"
                      />
                      <span className="text-[#1A2B4C]">Ho già prenotato volo/treno</span>
                    </label>

                    {formData.hasTransport && (
                      <div className="ml-8">
                        <input
                          type="text"
                          value={formData.transportDetails}
                          onChange={(e) => setFormData({ ...formData, transportDetails: e.target.value })}
                          placeholder="Orari di arrivo e partenza"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2F80ED] transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1A2B4C] to-[#2F80ED] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Riepilogo del tuo viaggio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-orange-200">Destinazione:</span>
                      <p className="font-semibold">{formData.destination || 'Non specificata'}</p>
                    </div>
                    <div>
                      <span className="text-orange-200">Date:</span>
                      <p className="font-semibold">
                        {formData.startDate && formData.endDate
                          ? `${formData.startDate} → ${formData.endDate}`
                          : 'Non specificate'}
                      </p>
                    </div>
                    <div>
                      <span className="text-orange-200">Viaggiatori:</span>
                      <p className="font-semibold">{formData.travelersCount} - {formData.travelersType}</p>
                    </div>
                    <div>
                      <span className="text-orange-200">Stile:</span>
                      <p className="font-semibold">{formData.budget} • {formData.pace}</p>
                    </div>
                    {formData.interests.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-orange-200">Interessi:</span>
                        <p className="font-semibold">{formData.interests.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-6">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-[#FF8A3D] to-[#E67628] text-white px-12 py-4 rounded-lg hover:from-[#E67628] hover:to-[#D66520] transition-all font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    Genera il mio itinerario
                  </button>
                  <p className="text-sm text-[#5B6473]">
                    Potrai sempre modificare l'itinerario dopo la generazione
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF8A3D] to-[#E67628] rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#1A2B4C] text-center mb-4">
                Ci pensiamo noi
              </h3>

              <p className="text-[#5B6473] text-center mb-6">
                Ti bastano meno di 2 minuti per completare questi dati. Il resto lo fa ItinerAI.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2F80ED] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A2B4C]">Itinerario ottimizzato</p>
                    <p className="text-sm text-[#5B6473]">Distanze, tempi e attività organizzate in modo intelligente</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2F80ED] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A2B4C]">Personalizzato per te</p>
                    <p className="text-sm text-[#5B6473]">Basato sulle tue preferenze e sul tuo stile di viaggio</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2F80ED] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A2B4C]">Sempre modificabile</p>
                    <p className="text-sm text-[#5B6473]">Puoi cambiare tutto quello che vuoi dopo la generazione</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-[#FF8A3D]">
                <p className="text-sm text-[#1A2B4C]">
                  <span className="font-bold">Nota:</span> L'itinerario verrà generato in pochi secondi. Tutti i dati sono salvati e potrai accedere al tuo piano in qualsiasi momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateItinerary;