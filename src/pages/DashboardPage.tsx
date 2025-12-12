import { useSelector } from 'react-redux'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function DashboardPage() {
  const user = useSelector((s: any) => s.auth.user)
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <aside className="md:col-span-1 space-y-2">
        <Card><div className="p-4">Menu
          <ul className="mt-2 space-y-2">
            <li><a href="/dashboard" className="underline">Dashboard</a></li>
            <li><a href="/booking" className="underline">Nuova prenotazione</a></li>
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
        <Card><div className="p-4 flex gap-2"><Button>Nuova prenotazione</Button><Button variant="ghost">Vedi statistiche</Button></div></Card>
      </section>
    </div>
  )
}
