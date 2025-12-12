import { useState } from 'react'
import { useRegisterMutation } from '../services/authApi'
import { useDispatch } from 'react-redux'
import { setAuth, setError, setLoading } from '../store/slices/authSlice'
import { Button } from '../components/ui/Button'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [register] = useRegisterMutation()
  const dispatch = useDispatch()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const valid = /.+@.+\..+/.test(email) && password.length >= 8 && password === confirm && name.length > 0
    if (!valid) return dispatch(setError('Dati non validi'))
    dispatch(setLoading())
    const res = await register({ email, password, name }).unwrap().catch((e) => { dispatch(setError('Registrazione fallita')); return null })
    if (res) dispatch(setAuth({ user: res.user, token: res.access_token }))
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Registrati</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Conferma password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button type="submit">Crea account</Button>
      </form>
    </div>
  )
}
