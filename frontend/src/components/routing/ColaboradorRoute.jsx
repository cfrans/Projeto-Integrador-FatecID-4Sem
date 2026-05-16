import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ColaboradorRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.role !== 'Colaborador') return <Navigate to="/admin" replace />
  return <Outlet />
}
