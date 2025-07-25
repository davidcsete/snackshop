import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { checkAuth } from '../features/auth/authSlice'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Check auth status when app loads
    dispatch(checkAuth())
  }, [dispatch])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return <>{children}</>
}