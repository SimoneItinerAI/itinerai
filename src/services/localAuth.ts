import crypto from 'crypto-js'

type User = { id: string; email: string; name: string; password_hash: string }
const KEY = 'itinerai:users'
const AUTH = 'itinerai:auth'

function readUsers(): User[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}
function writeUsers(users: User[]) {
  localStorage.setItem(KEY, JSON.stringify(users))
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const localAuth = {
  register(email: string, password: string, name: string) {
    const users = readUsers()
    if (users.find(u => u.email === email)) throw new Error('Email già registrata')
    const id = uid()
    const password_hash = crypto.SHA256(password).toString()
    const user = { id, email, name, password_hash }
    users.push(user)
    writeUsers(users)
    localStorage.setItem(AUTH, JSON.stringify({ token: `local-${id}`, user: { id, email, name } }))
    return { user: { id, email, name }, access_token: `local-${id}` }
  },
  login(email: string, password: string) {
    const users = readUsers()
    const u = users.find(x => x.email === email)
    if (!u) throw new Error('Credenziali non valide')
    const ok = crypto.SHA256(password).toString() === u.password_hash
    if (!ok) throw new Error('Credenziali non valide')
    localStorage.setItem(AUTH, JSON.stringify({ token: `local-${u.id}`, user: { id: u.id, email, name: u.name } }))
    return { user: { id: u.id, email, name: u.name }, access_token: `local-${u.id}` }
  },
  current() {
    const raw = localStorage.getItem(AUTH)
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  },
  logout() {
    localStorage.removeItem(AUTH)
  }
}
