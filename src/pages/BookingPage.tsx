import { useState } from 'react'
import type React from 'react'
import { useCreateMutation, useGetQuery } from '../services/bookingApi'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { pushToast } from '../store/slices/uiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '../components/ui/Spinner'
import { RootState } from '../store'

export default function BookingPage() {
  const [destination, setDestination] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [count, setCount] = useState(1)
  const [budget, setBudget] = useState<'economico'|'medio'|'comfort'>('medio')
  const [pace, setPace] = useState<'tranquillo'|'equilibrato'|'intenso'>('equilibrato')
  const [create] = useCreateMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const resources = useSelector((s: RootState) => s.booking.resources)
  const { data, isLoading, isError } = useGetQuery(id || '', { skip: !id })

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

  if (id) {
    if (isLoading) return <div className="p-8"><Spinner /></div>
    if (isError || !data) return <div className="p-8">Errore nel caricamento</div>
    return (
      <div className="container mx-auto p-6 grid md:grid-cols-3 gap-4">
        <Card><div className="p-4">
          <h2 className="font-semibold mb-2">Dettaglio prenotazione</h2>
          <div>Destinazione: {data.destination}</div>
          <div>Date: {data.start_date} → {data.end_date}</div>
          <div>Persone: {data.travelers_count}</div>
          <div>Budget: {data.budget}</div>
          <div>Pace: {data.pace}</div>
          <Button className="mt-3" onClick={onPay}>Paga</Button>
        </div></Card>
        <Card><div className="p-4">
          <h2 className="font-semibold mb-2">Risorse disponibili</h2>
          <div>{resources.length ? resources.join(', ') : 'Nessuna risorsa caricata'}</div>
        </div></Card>
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
