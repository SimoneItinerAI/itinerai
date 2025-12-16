import { useState } from 'react'
import { useRegisterMutation } from '../services/authApi'
import { useDispatch } from 'react-redux'
import { setAuth, setError, setLoading } from '../store/slices/authSlice'
import { pushToast } from '../store/slices/uiSlice'
import { Button } from '../components/ui/Button'
import { useNavigate, Link } from 'react-router-dom'
import type React from 'react'
import { localAuth } from '../services/localAuth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [register] = useRegisterMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const staticMode = import.meta.env.VITE_STATIC_MODE === 'true'

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const valid = /.+@.+\..+/.test(email) && password.length >= 8 && password === confirm && name.length > 0
    if (!valid) return dispatch(setError('Dati non validi'))
    dispatch(setLoading())
    const res = staticMode
      ? (() => { try { return localAuth.register(email, password, name) } catch { return null } })()
      : await register({ email, password, name }).unwrap().catch(() => { dispatch(setError('Registrazione fallita')); dispatch(pushToast({ id: Date.now().toString(), message: 'Registrazione fallita', type: 'error' })); return null })
    if (res) {
      dispatch(setAuth({ user: res.user, token: res.access_token }))
      dispatch(pushToast({ id: Date.now().toString(), message: 'Account creato', type: 'success' }))
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 pt-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block px-6">
            <h2 className="text-3xl font-bold text-primary mb-3">Inizia con ItinerAI</h2>
            <p className="text-neutral-600">Crea itinerari personalizzati con l’AI. Registrati gratis.</p>
          </div>
          <div className="w-full px-2 md:px-6">
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-primary mb-4">Registrati</h1>
              <form onSubmit={onSubmit} className="space-y-5" aria-label="Form di registrazione">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Nome</label>
                  <input id="name" name="name" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type="text" placeholder="Il tuo nome" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                  <input id="email" name="email" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type="email" placeholder="nome@esempio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
                  <input id="password" name="password" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700">Conferma password</label>
                  <input id="confirm" name="confirm" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type="password" placeholder="Ripeti la password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </div>
                <Button type="submit" className="w-full py-4 text-lg">Crea account</Button>
              </form>
              <div className="mt-5 text-sm flex flex-wrap items-center gap-4">
                <Link to="/login" className="underline">Hai già un account? Accedi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
