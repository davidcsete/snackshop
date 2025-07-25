// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'

export default function LogoutButton() {
  const logout = useLogout()
  const navigate = useNavigate()

  const handleClick = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <button onClick={handleClick} className="btn btn-sm btn-outline ml-4">
      Logout
    </button>
  )
}
