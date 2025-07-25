// src/hooks/useLogout.ts
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export const useLogout = () => {
  const dispatch = useDispatch()

  return async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    })

    dispatch(logout())
  }
}
