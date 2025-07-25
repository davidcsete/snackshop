import { useEffect } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
	fetchOrders,
	type Order,
} from '../features/admin/orderSlice/orderSlice'

export default function AdminOrders() {
	const dispatch = useAppDispatch()
	const { orders, loading, error, updating } = useAppSelector(state => state.orders)

	useEffect(() => {
		dispatch(fetchOrders())
	}, [dispatch])

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Rendelések kezelése</h1>

			{loading && <p>Töltés...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{orders.map((order: Order) => (
				<div key={order.id} className="border rounded-lg p-4 mb-6 shadow-sm">
					<div className="mb-3">
						<span className="font-medium text-gray-700">Felhasználó: </span>
						<span className="text-gray-900">{order.user}</span>
					</div>
					<div className="mt-4">
						<h4 className="font-semibold mb-1">Termékek:</h4>
						<ul className="list-disc ml-5 text-sm">
							{order.items.map((item, index) => (
								<li key={index}>
									{item.name} — {item.quantity} db x {item.price} Ft
								</li>
							))}
						</ul>
					</div>
				</div>
			))}
		</div>
	)
}
