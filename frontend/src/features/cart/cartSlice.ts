import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../products/productsSlice'
import axios from 'axios'


export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.items = state.items.filter(i => i.id !== action.payload)
        }
      }
    },
  },
})

export const placeOrder = createAsyncThunk(
    'cart/order',
    async (items: CartItem[], { rejectWithValue }) => {
      try {
        // Transform cart items to the format expected by backend
        const orderItems = items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
        
        const res = await axios.post(
          '/api/order',
          { items: orderItems },
          { withCredentials: true }
        )
        return res.data
      } catch (err: any) {
        return rejectWithValue(err.response?.data || { message: 'Unknown error' })
      }
    }
  )

export const { addToCart, removeFromCart, clearCart, decreaseQuantity } = cartSlice.actions

export default cartSlice.reducer
