
import type { ReactNode } from 'react'
import ProductList from '../components/ProductList'

interface AdminDashboardProps {
  children?: ReactNode
}

function AdminDashboard({ children }: AdminDashboardProps) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        {children}
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <p className="text-lg">You can manage products, view orders, and update the inventory from here.</p>
        <ProductList></ProductList>
      </div>
    )
  }
  
  export default AdminDashboard
  