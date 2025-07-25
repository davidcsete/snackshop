import { useState, useEffect } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import {
	removeFromCart,
	decreaseQuantity,
	addToCart,
	clearCart,
	type CartItem,
} from '../features/cart/cartSlice'
import { placeOrder } from '../features/cart/cartSlice'

export default function Cart() {
	const dispatch = useAppDispatch()
	const items = useAppSelector((state) => state.cart.items)

	const [ordering, setOrdering] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [errorMsg, setErrorMsg] = useState('')

	// Auto-dismiss success message after 5 seconds
	useEffect(() => {
		if (successMsg) {
			const timer = setTimeout(() => {
				setSuccessMsg('')
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [successMsg])

	const total = items.reduce(
		(acc: number, item: { price: number; quantity: number }) =>
			acc + item.price * item.quantity,
		0
	)

	const handleOrder = async () => {
		setOrdering(true)
		setSuccessMsg('')
		setErrorMsg('')
		try {
			const result = await dispatch(placeOrder(items)).unwrap()
			console.log('Order result:', result) // Debug log

			// Show browser alert first to confirm it's working
			// Remove alert, we'll show success message in UI instead

			setSuccessMsg(`Order placed successfully! Order ID: ${result.orderId} - Total: $${result.total.toFixed(2)}`)

			// Clear cart after setting success message
			setTimeout(() => {
				dispatch(clearCart())
			}, 100)
		} catch (err: any) {
			console.error('Order error:', err) // Debug log
			setErrorMsg(err.message || 'Failed to place order.')
		} finally {
			setOrdering(false)
		}
	}

	if (items.length === 0 && !successMsg) return <div className="p-6">Your cart is empty.</div>

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Your Cart</h2>

			{successMsg && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span><strong>Success:</strong> {successMsg}</span>
				</div>
			)}

			{errorMsg && (
				<div className="alert alert-error mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{errorMsg}</span>
				</div>
			)}

			<ul>
				{items.map((item: CartItem) => (
					<li key={item.id} className="flex justify-between items-center mb-4">
						<div>
							<div className="font-semibold">{item.name}</div>
							<div>${item.price.toFixed(2)}</div>
							<div>Quantity: {item.quantity}</div>
						</div>
						<div className="space-x-2">
							<button
								onClick={() => dispatch(decreaseQuantity(item.id))}
								className="btn btn-sm"
							>
								-
							</button>
							<button
								onClick={() => dispatch(addToCart(item))}
								className="btn btn-sm"
							>
								+
							</button>
							<button
								onClick={() => dispatch(removeFromCart(item.id))}
								className="btn btn-sm btn-error"
							>
								Remove
							</button>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-6 text-right">
				<p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
				<button
					className="btn btn-primary mt-4"
					onClick={handleOrder}
					disabled={ordering}
				>
					{ordering ? 'Placing Order...' : 'Place Order'}
				</button>
				<button
					className="btn btn-outline ml-4 mt-4"
					onClick={() => dispatch(clearCart())}
				>
					Clear Cart
				</button>
			</div>
		</div>
	)
}
