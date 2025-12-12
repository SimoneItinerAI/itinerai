import { useSelector, useDispatch } from 'react-redux'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import { pushToast } from '../store/slices/uiSlice'
import { RootState } from '../store'

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><div className="p-4">Prenotazioni attive: 0</div></Card>
          <Card><div className="p-4">Prossime partenze: 0</div></Card>
          <Card><div className="p-4">Messaggi: 0</div></Card>
        </div>
        <Card><div className="p-4 flex gap-2">
          <Button onClick={() => { navigate('/booking'); dispatch(pushToast({ id: Date.now().toString(), message: 'Avvia nuova prenotazione', type: 'info' })) }}>Nuova prenotazione</Button>
          <Button variant="ghost">Vedi statistiche</Button>
        </div></Card>
      </section>
    </div>
  )
}
