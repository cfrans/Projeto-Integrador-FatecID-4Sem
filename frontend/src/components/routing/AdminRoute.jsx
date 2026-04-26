import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.role !== 'Admin') return <Navigate to="/home" replace />
  return <Outlet />
}