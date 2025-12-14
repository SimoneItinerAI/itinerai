import { useMemo, useState } from 'react'
import type React from 'react'
import { useCreateMutation, useGetQuery, useUpdateMutation } from '../services/bookingApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { pushToast } from '../store/slices/uiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '../components/ui/Spinner'
import { RootState } from '../store'
import type { ItineraryData, ItineraryDay, Activity, Restaurant } from '../types'

export default function BookingPage() {
  const [destination, setDestination] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [count, setCount] = useState(1)
  const [budget, setBudget] = useState<'economico'|'medio'|'comfort'>('medio')
  const [pace, setPace] = useState<'tranquillo'|'equilibrato'|'intenso'>('equilibrato')
  const [create] = useCreateMutation()
  const [update] = useUpdateMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const resources = useSelector((s: RootState) => s.booking.resources)
  const { data, isLoading, isError } = useGetQuery(id || '', { skip: !id })
  const itineraryData: ItineraryData | undefined = useMemo(() => (data as any)?.itinerary_data, [data])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const valid = destination && start && end && count > 0
    if (!valid) { dispatch(pushToast({ id: Date.now().toString(), message: 'Compila tutti i campi', type: 'error' })); return }
    const res = await create({ destination, start_date: start, end_date: end, travelers_count: count, budget, pace }).unwrap().catch(() => { dispatch(pushToast({ id: Date.now().toString(), message: 'Salvataggio fallito', type: 'error' })); return null })
    if (res) { dispatch(pushToast({ id: Date.now().toString(), message: 'Prenotazione creata', type: 'success' })); navigate(`/booking/${res.id}`) }
  }

  const onPay = async () => {
    const key = import.meta.env.VITE_STRIPE_KEY || ''
    if (!key) { dispatch(pushToast({ id: Date.now().toString(), message: 'Chiave Stripe mancante', type: 'error' })); return }
    const stripe = await loadStripe(key)
    if (!stripe) { dispatch(pushToast({ id: Date.now().toString(), message: 'Stripe non inizializzato', type: 'error' })); return }
    dispatch(pushToast({ id: Date.now().toString(), message: 'Pagamento avviato', type: 'info' }))
  }

  const onSelectProposal = async () => {
    if (!data || itineraryData?.proposals?.length === 0) return
    const payload = { constraints: { ...((data as any).constraints || {}), selected_proposal_index: selectedIndex } }
    try {
      await update({ id: data.id, data: payload }).unwrap()
      dispatch(pushToast({ id: Date.now().toString(), message: 'Proposta selezionata', type: 'success' }))
    } catch {
      dispatch(pushToast({ id: Date.now().toString(), message: 'Errore nel salvataggio della selezione', type: 'error' }))
    }
  }

  if (id) {
    if (isLoading) return <div className="p-8"><Spinner /></div>
    if (isError || !data) return <div className="p-8">Errore nel caricamento</div>
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dettaglio prenotazione</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div>Destinazione: {data.destination}</div>
              <div>Date: {data.start_date} → {data.end_date}</div>
              <div>Persone: {data.travelers_count}</div>
              <div>Budget: {data.budget}</div>
              <div>Pace: {data.pace}</div>
              <Button className="mt-3" onClick={onPay}>Paga</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risorse disponibili</CardTitle>
            </CardHeader>
            <CardContent>
              <div>{resources.length ? resources.join(', ') : 'Nessuna risorsa caricata'}</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposte generate</CardTitle>
          </CardHeader>
          <CardContent>
            {!itineraryData?.proposals?.length && (
              <div className="text-neutral-600">Nessuna proposta disponibile. Riprovare la generazione dalla pagina Crea Itinerario.</div>
            )}
            {!!itineraryData?.proposals?.length && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="font-medium text-primary">Seleziona proposta</label>
                  <select
                    className="border rounded p-2"
                    value={selectedIndex}
                    onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  >
                    {itineraryData.proposals.map((p, idx) => (
                      <option key={p.id} value={idx}>{p.title} (compatibilità {Math.round(p.compatibility_score * 100)}%)</option>
                    ))}
                  </select>
                  <Button onClick={onSelectProposal}>Salva selezione</Button>
                </div>
                <div className="space-y-6">
                  {(() => {
                    const proposal = itineraryData.proposals[selectedIndex]
                    if (!proposal) return null
                    return (
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{proposal.title}</h3>
                        <p className="text-neutral-600 mb-4">{proposal.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card><CardContent>
                            <div>Compatibilità: {Math.round(proposal.compatibility_score * 100)}%</div>
                          </CardContent></Card>
                          <Card><CardContent>
                            <div>Durata: {proposal.duration} giorni</div>
                          </CardContent></Card>
                          <Card><CardContent>
                            <div>Budget stimato: €{proposal.estimated_budget}</div>
                          </CardContent></Card>
                        </div>
                        <div className="space-y-8">
                          {proposal.days.map((day: ItineraryDay) => (
                            <div key={`${day.date}-${day.day}`} className="border-l-4 border-accent pl-4">
                              <h4 className="text-lg font-semibold text-primary mb-2">Giorno {day.day} - {day.date}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card><CardContent className="space-y-2">
                                  <div className="font-medium">Attività</div>
                                  {day.activities?.length ? day.activities.map((a: Activity) => (
                                    <div key={a.id} className="text-sm">
                                      <div className="font-semibold text-primary">{a.name}</div>
                                      {(a.start_time || a.end_time) && <div>{[a.start_time, a.end_time].filter(Boolean).join(' - ')}</div>}
                                      {a.location?.name && <div className="text-neutral-600">{a.location.name}</div>}
                                    </div>
                                  )) : <div className="text-neutral-600">Nessuna attività</div>}
                                </CardContent></Card>
                                <Card><CardContent className="space-y-2">
                                  <div className="font-medium">Ristoranti</div>
                                  {day.restaurants?.length ? day.restaurants.map((r: Restaurant) => (
                                    <div key={r.id} className="text-sm">
                                      <div className="font-semibold text-primary">{r.name}</div>
                                      <div>{r.meal_type} • {r.cuisine}</div>
                                      {r.location?.name && <div className="text-neutral-600">{r.location.name}</div>}
                                    </div>
                                  )) : <div className="text-neutral-600">Nessun ristorante</div>}
                                </CardContent></Card>
                              </div>
                              {day.notes && <div className="mt-2 text-neutral-600">{day.notes}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-3 gap-4">
      <Card><form onSubmit={onSubmit} className="p-4 space-y-3">
        <input className="w-full border rounded p-2" placeholder="Destinazione" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded p-2" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <input className="border rounded p-2" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <input className="w-full border rounded p-2" type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
         <select className="w-full border rounded p-2" value={budget} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBudget(e.target.value as 'economico'|'medio'|'comfort')}>
          <option value="economico">Economico</option>
          <option value="medio">Medio</option>
          <option value="comfort">Comfort</option>
        </select>
         <select className="w-full border rounded p-2" value={pace} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPace(e.target.value as 'tranquillo'|'equilibrato'|'intenso')}>
          <option value="tranquillo">Tranquillo</option>
          <option value="equilibrato">Equilibrato</option>
          <option value="intenso">Intenso</option>
        </select>
        <Button type="submit">Salva</Button>
      </form></Card>
      <Card><div className="p-4">
        <h2 className="font-semibold mb-2">Riepilogo</h2>
        <div>Destinazione: {destination}</div>
        <div>Date: {start} → {end}</div>
        <div>Persone: {count}</div>
        <div>Budget: {budget}</div>
        <div>Pace: {pace}</div>
        <Button className="mt-3" onClick={onPay}>Paga</Button>
      </div></Card>
      <Card><div className="p-4">
        <h2 className="font-semibold mb-2">Risorse disponibili</h2>
        <div>{resources.length ? resources.join(', ') : 'Nessuna risorsa caricata'}</div>
      </div></Card>
    </div>
  )
}
