// src/features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Product {
    stock: number
    id: number
    name: string
    price: number
}

interface ProductsState {
    items: Product[]
    loading: boolean
    error: string | null
}

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
}

// Fetch all products (GET /api/products)
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
    const res = await axios.get('/api/products', { withCredentials: true })
    return res.data as Product[]
})

// Create product (POST /api/products)
export const createProduct = createAsyncThunk(
    'products/create',
    async (product: Omit<Product, 'id'>) => {
        const res = await axios.post('/api/products', product, { withCredentials: true })
        return res.data as Product
    }
)

// Update product (PUT /api/products/:id)
export const updateProduct = createAsyncThunk(
    'products/update',
    async (product: Product) => {
        const res = await axios.put(`/api/products/${product.id}`, product, {
            withCredentials: true,
        })
        return res.data as Product
    }
)

// Delete product (DELETE /api/products/:id)
export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: number) => {
        await axios.delete(`/api/products/${id}`, { withCredentials: true })
        return id
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch products'
            })

            // Create
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })

            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id)
                if (index !== -1) state.items[index] = action.payload
            })

            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload)
            })
    },
})

export default productsSlice.reducer
