import { useState } from 'react'
import { useCreateMutation } from '../services/bookingApi'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { loadStripe } from '@stripe/stripe-js'

export default function BookingPage() {
  const [destination, setDestination] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [count, setCount] = useState(1)
  const [budget, setBudget] = useState<'economico'|'medio'|'comfort'>('medio')
  const [pace, setPace] = useState<'tranquillo'|'equilibrato'|'intenso'>('equilibrato')
  const [create] = useCreateMutation()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const valid = destination && start && end && count > 0
    if (!valid) return
    await create({ destination, start_date: start, end_date: end, travelers_count: count, budget, pace }).unwrap().catch(() => null)
  }

  const onPay = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY || '')
    if (!stripe) return
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
        <select className="w-full border rounded p-2" value={budget} onChange={(e) => setBudget(e.target.value as any)}>
          <option value="economico">Economico</option>
          <option value="medio">Medio</option>
          <option value="comfort">Comfort</option>
        </select>
        <select className="w-full border rounded p-2" value={pace} onChange={(e) => setPace(e.target.value as any)}>
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
        <div>Nessuna risorsa caricata</div>
      </div></Card>
    </div>
  )
}
