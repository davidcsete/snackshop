import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchProducts, type Product } from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'

export default function UserProductList() {
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  )
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchProducts())
    }
  }, [dispatch, isAuthenticated, isAdmin])

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Available Snacks</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <div key={product.id} className="card bg-base-100 shadow-md p-4">
            <h4 className="text-xl font-bold">{product.name}</h4>
            <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>

            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
