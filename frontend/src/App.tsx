import { Routes, Route, Navigate, Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'
import LogoutButton from './components/LogoutButton'
import Cart from './components/Cart'
import AdminOrders from './components/AdminOrders'

function AdminLayout() {
  const location = useLocation()
  const isOnOrdersPage = location.pathname === '/admin/orders'

  return (
    <PrivateRoute adminOnly>
      <div className="mt-2 bg-base-200">
        <LogoutButton />
        {isOnOrdersPage ? (
          <Link to="/admin" className="ml-2 btn btn-sm btn-secondary">← Back to Admin Dashboard</Link>
        ) : (
          <Link to="/admin/orders" className="ml-2 btn btn-sm btn-primary">Orders</Link>
        )}
      </div>
      <Outlet />
    </PrivateRoute>
  )
}

function App() {
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth)

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/user"} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/user"} />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <UserDashboard>
              <div className='bg-base-200'>
                <LogoutButton />
                <Link to="/cart" className="btn btn-sm btn-ghost">
                  🛒 Cart
                </Link>
              </div>
            </UserDashboard>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  )
}

export default App
