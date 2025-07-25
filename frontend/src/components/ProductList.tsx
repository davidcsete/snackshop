import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import {
    fetchProducts,
    deleteProduct,
    updateProduct,
    type Product,
} from '../features/products/productsSlice'
import ProductForm from './ProductForm'

export default function ProductList() {
    const dispatch = useDispatch<AppDispatch>()
    const { items: products, loading, error } = useSelector(
        (state: RootState) => state.products
    )
    const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchProducts())
        }
    }, [dispatch, isAuthenticated])

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }
    }

    const handleStockChange = (product: Product, newStock: number) => {
        if (newStock >= 0) {
            dispatch(updateProduct({ ...product, stock: newStock }))
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Snack Products</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {isAdmin && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
                    <ProductForm />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: Product) => (
                    <div key={product.id} className="card bg-base-100 shadow-md p-4">
                        <h4 className="text-xl font-bold">{product.name}</h4>
                        <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>

                        {isAdmin && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Stock:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={product.stock}
                                        onChange={(e) => handleStockChange(product, parseInt(e.target.value) || 0)}
                                        className="input input-sm input-bordered w-20"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {/* Optional: For future editing support */}
                                    {/* <button className="btn btn-sm btn-outline">Edit</button> */}
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
