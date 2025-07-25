
import type { ReactNode } from 'react'
import UserProductList from '../components/UserProductList'

interface UserDashboardProps {
  children?: ReactNode
}

function UserDashboard({ children }: UserDashboardProps) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        {children}
        <h1 className="text-3xl font-bold mb-6">Welcome to the Snack Shop</h1>
        <p className="text-lg">Here you will be able to browse snacks, add to cart, and place orders.</p>
        <UserProductList/>
      </div>
    )
  }
  
  export default UserDashboard
  