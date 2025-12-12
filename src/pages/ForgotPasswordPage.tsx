import { useState } from 'react'
import { useForgotPasswordMutation } from '../services/authApi'
import { Button } from '../components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [forgot] = useForgotPasswordMutation()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const valid = /.+@.+\..+/.test(email)
    if (!valid) return
    const res = await forgot({ email }).unwrap().catch(() => null)
    if (res) setSent(true)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Recupero password</h1>
      {sent ? (
        <p>Se l'email è corretta, riceverai un link di recupero.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Invia</Button>
        </form>
      )}
    </div>
  )
}
