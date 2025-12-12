import { useState } from 'react'
import { useLoginMutation } from '../services/authApi'
import { useDispatch } from 'react-redux'
import { setAuth, setError, setLoading } from '../store/slices/authSlice'
import { Button } from '../components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [login] = useLoginMutation()
  const dispatch = useDispatch()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const valid = /.+@.+\..+/.test(email) && password.length >= 8
    if (!valid) return dispatch(setError('Credenziali non valide'))
    dispatch(setLoading())
    const res = await login({ email, password }).unwrap().catch((e) => { dispatch(setError('Login fallito')); return null })
    if (res) dispatch(setAuth({ user: res.user, token: res.access_token }))
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Accedi</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input className="w-full border rounded p-2" type={show ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-2 top-2 text-sm" onClick={() => setShow(!show)}>{show ? 'Nascondi' : 'Mostra'}</button>
        </div>
        <Button type="submit">Login</Button>
      </form>
      <div className="mt-4 text-sm">
        <a href="/forgot-password" className="underline">Password dimenticata?</a>
      </div>
    </div>
  )
}
