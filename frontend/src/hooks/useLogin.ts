// src/hooks/useLogin.ts
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../features/auth/authSlice'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for cookie-based auth
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.authenticated) {
        throw new Error(data.message || 'Authentication failed')
      }

      dispatch(loginSuccess({ username, isAdmin: data.isAdmin }))
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
