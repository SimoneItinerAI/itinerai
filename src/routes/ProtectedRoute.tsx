import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../store'

export default function ProtectedRoute() {
  const token = useSelector((s: RootState) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
