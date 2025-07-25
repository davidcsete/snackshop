// src/components/PrivateRoute.tsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../store/store'

interface PrivateRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    // Not an admin, but trying to access admin-only route
    return <Navigate to="/user" replace />
  }

  // All checks passed → render the child component
  return <>{children}</>
}
