import { useSelector, useDispatch } from 'react-redux'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import { pushToast } from '../store/slices/uiSlice'
import { RootState } from '../store'
import { useListQuery } from '../services/bookingApi'

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: itineraries = [], isLoading } = useListQuery()
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <aside className="md:col-span-1 space-y-2">
        <Card><div className="p-4">Menu
          <ul className="mt-2 space-y-2">
            <li><Link to="/dashboard" className="underline">Dashboard</Link></li>
            <li><Link to="/booking" className="underline">Nuova prenotazione</Link></li>
          </ul>
        </div></Card>
      </aside>
      <section className="md:col-span-3 space-y-4">
        <Card><div className="p-4">Benvenuto {user?.name || ''}</div></Card>
        <Card><div className="p-4">
          <h2 className="font-semibold mb-2">I miei itinerari</h2>
          {isLoading ? (
            <div>Caricamento…</div>
          ) : (
            <ul className="space-y-2">
              {itineraries.length === 0 && <li className="text-neutral-600">Nessun itinerario</li>}
              {itineraries.map((it) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary">{it.destination}</div>
                    <div className="text-sm text-neutral-600">{it.start_date} → {it.end_date} • {it.travelers_count} persone • {it.budget}</div>
                  </div>
                  <Link to={`/booking/${it.id}`} className="underline">Apri</Link>
                </li>
              ))}
            </ul>
          )}
        </div></Card>
        <Card><div className="p-4 flex gap-2">
          <Button onClick={() => { navigate('/booking'); dispatch(pushToast({ id: Date.now().toString(), message: 'Avvia nuova prenotazione', type: 'info' })) }}>Nuova prenotazione</Button>
          <Button variant="ghost">Vedi statistiche</Button>
        </div></Card>
      </section>
    </div>
  )
}
