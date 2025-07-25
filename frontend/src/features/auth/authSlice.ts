// src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  username: string | null
}

// Check if auth cookie exists
const getAuthFromCookie = () => {
  try {
    // Get all cookies and parse the auth cookie
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='))
    
    if (authCookie) {
      const cookieValue = authCookie.split('=')[1]
      const authData = JSON.parse(decodeURIComponent(cookieValue))
      return {
        isAuthenticated: true,
        isAdmin: authData.isAdmin || false,
        username: authData.username || 'User'
      }
    }
  } catch (error) {
    console.error('Error parsing auth cookie:', error)
  }
  
  return {
    isAuthenticated: false,
    isAdmin: false,
    username: null
  }
}

const initialState: AuthState = getAuthFromCookie()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ username: string; isAdmin: boolean }>
    ) => {
      state.isAuthenticated = true
      state.isAdmin = action.payload.isAdmin
      state.username = action.payload.username
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.isAdmin = false
      state.username = null
      // Clear the auth cookie
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
