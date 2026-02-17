'use client';

import { useState, useEffect } from 'react';

interface Order {
    _id: string;
    orderNumber: string;
    customerInfo: {
        name: string;
        email: string;
    };
    items: { name: string; quantity: number }[];
    total: number;
    status: string;
    createdAt: string;
}

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            loadOrders();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Orders</h1>
                <span style={{ color: '#a0a0a0' }}>{orders.length} total orders</span>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td><strong>{order.orderNumber}</strong></td>
                                <td>
                                    <div>
                                        <div>{order.customerInfo.name}</div>
                                        <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>{order.customerInfo.email}</div>
                                    </div>
                                </td>
                                <td>{order.items.length} items</td>
                                <td><strong>{formatPrice(order.total)}</strong></td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={e => updateStatus(order._id, e.target.value)}
                                        className={`status-badge ${order.status}`}
                                        style={{
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '6px 12px',
                                            borderRadius: 20
                                        }}
                                    >
                                        {STATUSES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
