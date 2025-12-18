import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Plus, 
  Minus,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Baby,
  Edit3,
  Building,
  Car
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TravelPreferences } from '../types';
import { useGenerateMutation, useRefineMutation, useNormalizePreferencesMutation, useAggregateSearchMutation } from '../services/bookingApi';
import { useDispatch } from 'react-redux';
import { pushToast } from '../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { staticApi } from '../services/staticApi';

export const CreateItineraryPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<any | null>(null);
  const [refineText, setRefineText] = useState('');
  const [preferences, setPreferences] = useState<TravelPreferences>({
    destination: '',
    startDate: '',
    endDate: '',
    travelersCount: 2,
    travelersType: 'adults',
    budget: 'medio',
    pace: 'equilibrato',
    interests: [],
    hasKids: false,
    reducedMobility: false,
    existingAccommodation: '',
    existingTransport: '',
    notes: ''
  });
  const [generateItinerary, { isLoading }] = useGenerateMutation();
  const [refine, { isLoading: isRefining }] = useRefineMutation();
  const [normalizePreferences] = useNormalizePreferencesMutation();
  const [aggregateSearch] = useAggregateSearchMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalSteps = 4;

  const interests = [
    'Cultura', 'Storia', 'Arte', 'Musica', 'Cucina', 'Vino',
    'Natura', 'Avventura', 'Sport', 'Relax', 'Shopping', 'Fotografia',
    'Architettura', 'Musei', 'Spiagge', 'Montagna', 'Città', 'Campagna'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const staticMode = import.meta.env.VITE_STATIC_MODE === 'true'
      const payload = {
        destination: preferences.destination,
        start_date: preferences.startDate,
        end_date: preferences.endDate,
        travelers_count: preferences.travelersCount,
        travelers_type: preferences.travelersType,
        budget: preferences.budget,
        pace: preferences.pace,
        interests: preferences.interests,
        constraints: {
          has_kids: preferences.hasKids,
          reduced_mobility: preferences.reducedMobility,
          existing_accommodation: preferences.existingAccommodation,
          existing_transport: preferences.existingTransport
        },
        notes: preferences.notes
      };
      const prefsInput = {
        destination: payload.destination,
        startDate: payload.start_date,
        endDate: payload.end_date,
        durationDays: undefined,
        travelers: { adults: payload.travelers_count, children: 0 },
        budgetTotalEur: 0,
        tripStyle: payload.pace === 'tranquillo' ? 'relaxed' : payload.pace === 'equilibrato' ? 'balanced' : 'fast',
        interests: payload.interests || [],
        constraints: Object.keys(payload.constraints || {})
      }
      const normalized = staticMode ? prefsInput : await normalizePreferences(prefsInput).unwrap()
      const searchReq = { destination: payload.destination, startDate: payload.start_date, endDate: payload.end_date, travelers: { adults: payload.travelers_count, children: 0 }, interests: payload.interests || [] }
      const allowed = staticMode ? { results: [] } : await aggregateSearch(searchReq).unwrap()
      const res = staticMode
        ? { itinerary: staticApi.generate(payload), days: [], items: [] }
        : await generateItinerary({ ...payload, search_results: allowed.results }).unwrap();
      setResult(res);
      // show normalized summary
      dispatch(pushToast({ id: Date.now().toString(), message: `Preferenze normalizzate per ${normalized.destination?.city || normalized.destination?.raw || payload.destination}`, type: 'info' }));
      dispatch(pushToast({ id: Date.now().toString(), message: 'Itinerario generato', type: 'success' }));
    } catch (e: any) {
      dispatch(pushToast({ id: Date.now().toString(), message: e?.data?.error?.message || 'Errore generazione', type: 'error' }));
    }
  };
  
  const handleRefine = async () => {
    if (!result?.itinerary?.id || !refineText.trim()) return;
    try {
      const res = await refine({ id: result.itinerary.id, instructions: refineText.trim() }).unwrap();
      setResult(res);
      setRefineText('');
      dispatch(pushToast({ id: Date.now().toString(), message: 'Itinerario aggiornato', type: 'success' }));
    } catch (e: any) {
      dispatch(pushToast({ id: Date.now().toString(), message: e?.data?.error?.message || 'Errore raffinamento', type: 'error' }));
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateTravelers = (increment: boolean) => {
    setPreferences(prev => ({
      ...prev,
      travelersCount: Math.max(1, Math.min(10, prev.travelersCount + (increment ? 1 : -1)))
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Informazioni di base</h2>
              <p className="text-neutral-600">Cominciamo con le informazioni fondamentali del tuo viaggio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Destinazione
                </label>
                <input
                  type="text"
                  placeholder="Roma, Parigi, Tokyo..."
                  value={preferences.destination}
                  onChange={(e) => setPreferences({...preferences, destination: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  <Users className="w-4 h-4 inline mr-2" />
                  Tipo di viaggiatori
                </label>
                <select
                  value={preferences.travelersType}
                  onChange={(e) => setPreferences({...preferences, travelersType: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                >
                  <option value="adults">Solo adulti</option>
                  <option value="family">Famiglia</option>
                  <option value="couple">Coppia</option>
                  <option value="friends">Amici</option>
                  <option value="solo">Solo traveller</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data di partenza
                </label>
                <input
                  type="date"
                  value={preferences.startDate}
                  onChange={(e) => setPreferences({...preferences, startDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data di ritorno
                </label>
                <input
                  type="date"
                  value={preferences.endDate}
                  onChange={(e) => setPreferences({...preferences, endDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-primary">
                  <Users className="w-4 h-4 inline mr-2" />
                  Numero di viaggiatori
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateTravelers(false)}
                    className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold text-primary min-w-[3rem] text-center">
                    {preferences.travelersCount}
                  </span>
                  <button
                    onClick={() => updateTravelers(true)}
                    className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Stile di viaggio</h2>
              <p className="text-neutral-600">Aiutaci a capire il tuo stile e preferenze</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-primary mb-4">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Budget
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['economico', 'medio', 'comfort'].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setPreferences({...preferences, budget: budget as 'economico'|'medio'|'comfort'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        preferences.budget === budget
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-lg font-semibold capitalize">{budget}</div>
                      <div className="text-sm text-neutral-600 mt-1">
                        {budget === 'economico' && '€50-100/giorno'}
                        {budget === 'medio' && '€100-200/giorno'}
                        {budget === 'comfort' && '€200+/giorno'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-4">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Ritmo del viaggio
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['tranquillo', 'equilibrato', 'intenso'].map((pace) => (
                    <button
                      key={pace}
                      onClick={() => setPreferences({...preferences, pace: pace as 'tranquillo'|'equilibrato'|'intenso'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        preferences.pace === pace
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-lg font-semibold capitalize">{pace}</div>
                      <div className="text-sm text-neutral-600 mt-1">
                        {pace === 'tranquillo' && '2-3 attività al giorno'}
                        {pace === 'equilibrato' && '3-4 attività al giorno'}
                        {pace === 'intenso' && '4-6 attività al giorno'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-4">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Interessi (seleziona tutti quelli che ti interessano)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        preferences.interests.includes(interest)
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Vincoli e preferenze speciali</h2>
              <p className="text-neutral-600">Facci sapere di eventuali esigenze particolari</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-neutral-200">
                  <input
                    type="checkbox"
                    id="hasKids"
                    checked={preferences.hasKids}
                    onChange={(e) => setPreferences({...preferences, hasKids: e.target.checked})}
                    className="w-5 h-5 text-accent rounded focus:ring-accent"
                  />
                  <label htmlFor="hasKids" className="flex items-center space-x-2 cursor-pointer">
                    <Baby className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">Viaggi con bambini</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-neutral-200">
                  <input
                    type="checkbox"
                    id="reducedMobility"
                    checked={preferences.reducedMobility}
                    onChange={(e) => setPreferences({...preferences, reducedMobility: e.target.checked})}
                    className="w-5 h-5 text-accent rounded focus:ring-accent"
                  />
                  <label htmlFor="reducedMobility" className="flex items-center space-x-2 cursor-pointer">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">Mobilità ridotta</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Alloggio già prenotato? (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Nome hotel o indirizzo"
                  value={preferences.existingAccommodation}
                  onChange={(e) => setPreferences({...preferences, existingAccommodation: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Trasporto già prenotato? (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Dettagli volo, treno, auto..."
                  value={preferences.existingTransport}
                  onChange={(e) => setPreferences({...preferences, existingTransport: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Note aggiuntive (opzionale)
                </label>
                <textarea
                  placeholder="Diete speciali, allergie, preferenze particolari..."
                  value={preferences.notes}
                  onChange={(e) => setPreferences({...preferences, notes: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Riepilogo</h2>
              <p className="text-neutral-600">Controlla tutte le informazioni prima di generare il tuo itinerario</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Informazioni di base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><strong>Destinazione:</strong> {preferences.destination || 'Non specificata'}</div>
                  <div><strong>Partenza:</strong> {preferences.startDate || 'Non specificata'}</div>
                  <div><strong>Ritorno:</strong> {preferences.endDate || 'Non specificata'}</div>
                  <div><strong>Viaggiatori:</strong> {preferences.travelersCount} {preferences.travelersType}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Preferenze
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><strong>Budget:</strong> {preferences.budget}</div>
                  <div><strong>Ritmo:</strong> {preferences.pace}</div>
                  <div><strong>Interessi:</strong> {preferences.interests.length > 0 ? preferences.interests.join(', ') : 'Nessuno selezionato'}</div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Vincoli speciali
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><strong>Bambini:</strong> {preferences.hasKids ? 'Sì' : 'No'}</div>
                  <div><strong>Mobilità ridotta:</strong> {preferences.reducedMobility ? 'Sì' : 'No'}</div>
                  {preferences.existingAccommodation && <div><strong>Alloggio:</strong> {preferences.existingAccommodation}</div>}
                  {preferences.existingTransport && <div><strong>Trasporto:</strong> {preferences.existingTransport}</div>}
                  {preferences.notes && <div><strong>Note:</strong> {preferences.notes}</div>}
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-secondary/10 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold text-primary">Generazione AI in arrivo!</h3>
              </div>
              <p className="text-neutral-600">
                Il nostro AI analizzerà migliaia di combinazioni per creare 2-3 proposte di itinerario 
                perfettamente adatte alle tue esigenze. Questo processo richiederà circa 2-3 minuti.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      i + 1 <= currentStep
                        ? 'bg-accent text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        i + 1 < currentStep ? 'bg-accent' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-neutral-600">
              Passo {currentStep} di {totalSteps}
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Indietro</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Avanti</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="flex items-center space-x-2"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Generazione...' : 'Genera Itinerario'}</span>
              </Button>
            )}
          </div>
          
          {/* Risultato */}
          {result && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Risultato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-primary mb-2">Raffina con istruzioni (conversazione)</label>
                    <input
                      type="text"
                      placeholder="Es. più attività all’aperto, riduci camminate, aggiungi museo moderno..."
                      value={refineText}
                      onChange={(e) => setRefineText(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                  <Button variant="primary" onClick={handleRefine} disabled={isRefining || !refineText.trim()}>
                    {isRefining ? 'Aggiornamento...' : 'Raffina itinerario'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card><CardContent>
                    <div><strong>Destinazione:</strong> {result.itinerary?.destination}</div>
                  </CardContent></Card>
                  <Card><CardContent>
                    <div><strong>Date:</strong> {result.itinerary?.start_date?.toString?.() || result.itinerary?.start_date} → {result.itinerary?.end_date?.toString?.() || result.itinerary?.end_date}</div>
                  </CardContent></Card>
                  <Card><CardContent>
                    <div><strong>Persone:</strong> {result.itinerary?.travelers_count}</div>
                  </CardContent></Card>
                </div>
                <div className="space-y-8">
                  {result.days?.map((day: any) => (
                    <div key={day.id} className="border-l-4 border-accent pl-4">
                      <h4 className="text-lg font-semibold text-primary mb-2">{day.label} • {new Date(day.date).toISOString().slice(0,10)}</h4>
                      <div className="space-y-3">
                        {result.items?.filter((i: any) => i.day_id === day.id).map((item: any) => (
                          <div key={item.id} className="p-3 rounded border">
                            <div className="font-semibold text-primary">{item.title}</div>
                            {item.start_time || item.end_time ? (
                              <div className="text-sm">{[item.start_time, item.end_time].filter(Boolean).join(' - ')}</div>
                            ) : null}
                            {item.description && <div className="text-neutral-700 text-sm">{item.description}</div>}
                            {item.externalUrl && (
                              <div className="mt-2">
                                <Button variant="outline" onClick={() => window.open(item.externalUrl, '_blank')}>
                                  {item.externalProvider === 'booking' ? 'Vedi hotel' : 'Vedi attività'}
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
