// src/features/admin/orderSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
  product: {
    id: number
    name: string
  }
}

export interface Order {
  id: number
  user: string
  total: number
  items: OrderItem[]
  status?: string
  createdAt: string
}

interface OrderState {
  orders: Order[]
  loading: boolean
  updating: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  updating: false,
  error: null,
}

export const fetchOrders = createAsyncThunk('admin/fetchOrders', async () => {
  const res = await axios.get('/api/orders', { withCredentials: true })
  console.log(res.data)
  return res.data as Order[]
})

const orderSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch orders'
      })
  },
})

export default orderSlice.reducer
