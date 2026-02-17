'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    totalRevenue: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => '₹' + amount.toLocaleString('en-IN');

    const statCards = [
        { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: '#FF4B2B' },
        { icon: Package, label: 'Pending Orders', value: stats.pendingOrders, color: '#2196f3' },
        { icon: Package, label: 'Total Products', value: stats.totalProducts, color: '#9c27b0' },
        { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#4caf50' },
    ];

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="admin-header">
                <h1>Dashboard</h1>
                <p style={{ color: '#a0a0a0' }}>Welcome back, Administrator</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-card__header">
                            <div className="stat-card__icon" style={{ background: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <TrendingUp size={20} style={{ color: '#4caf50' }} />
                        </div>
                        <div className="stat-card__value">{stat.value}</div>
                        <div className="stat-card__label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="admin-table-container">
                <div style={{ padding: '1.5rem' }}>
                    <h3>Quick Actions</h3>
                    <p style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>
                        Use the sidebar to navigate to Products or Orders management.
                    </p>
                </div>
            </div>
        </div>
    );
}
