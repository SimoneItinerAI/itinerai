import { useState } from 'react'
import { useLoginMutation } from '../services/authApi'
import { useDispatch } from 'react-redux'
import { setAuth, setError, setLoading } from '../store/slices/authSlice'
import { Button } from '../components/ui/Button'
import { pushToast } from '../store/slices/uiSlice'
import { Link, useNavigate } from 'react-router-dom'
import type React from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [login] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const valid = /.+@.+\..+/.test(email) && password.length >= 8
    if (!valid) return dispatch(setError('Credenziali non valide'))
    dispatch(setLoading())
    const res = await login({ email, password }).unwrap().catch(() => { dispatch(setError('Login fallito')); dispatch(pushToast({ id: Date.now().toString(), message: 'Login fallito', type: 'error' })); return null })
    if (res) {
      dispatch(setAuth({ user: res.user, token: res.access_token }))
      dispatch(pushToast({ id: Date.now().toString(), message: 'Benvenuto!', type: 'success' }))
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 pt-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block px-6">
            <h2 className="text-3xl font-bold text-primary mb-3">Benvenuto su ItinerAI</h2>
            <p className="text-neutral-600">Crea itinerari personalizzati in pochi minuti. Accedi per iniziare.</p>
          </div>
          <div className="w-full px-2 md:px-6">
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-primary mb-4">Accedi</h1>
              <form onSubmit={onSubmit} className="space-y-5" aria-label="Form di accesso">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                  <input id="email" name="email" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type="email" placeholder="nome@esempio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
                  <input id="password" name="password" aria-required="true" className="w-full border rounded-lg p-4 text-lg mt-1 focus:outline-none focus:ring-2 focus:ring-accent" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="absolute right-3 top-9 text-sm text-primary" onClick={() => setShow(!show)}>{show ? 'Nascondi' : 'Mostra'}</button>
                </div>
                <Button type="submit" className="w-full py-4 text-lg">Login</Button>
              </form>
              <div className="mt-5 text-sm flex flex-wrap items-center gap-4">
                <Link to="/forgot-password" className="underline">Password dimenticata?</Link>
                <Link to="/register" className="underline">Crea un account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
