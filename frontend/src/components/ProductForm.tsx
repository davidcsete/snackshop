// src/components/ProductForm.tsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { createProduct } from '../features/products/productsSlice'

export default function ProductForm() {
    const dispatch = useDispatch<AppDispatch>()

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !price || !stock) return

        const priceNumber = parseFloat(price)
        const stockNumber = parseFloat(stock)

        if (isNaN(priceNumber) || priceNumber < 0) return
        if (isNaN(stockNumber) || stockNumber < 0) return

        dispatch(
            createProduct({
                name,
                price: priceNumber,
                stock: stockNumber
            })
        )

        setName('')
        setPrice('')
        setStock('')
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Price"
                className="input input-bordered w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                required
            />
            <input
                type="number"
                placeholder="Stock"
                className="input input-bordered w-full"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                step="0.01"
                min="0"
                required
            />
            <button type="submit" className="btn btn-primary w-full">
                Add Product
            </button>
        </form>
    )
}
