'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '../admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout, isAdmin } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading && (!user || !isAdmin)) {
            router.push('/admin');
        }
    }, [user, loading, isAdmin, router, mounted]);

    if (!mounted || loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!user || !isAdmin) {
        return null;
    }

    const navLinks = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    ];

    const handleLogout = () => {
        logout();
        router.push('/admin');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <span>🏆</span>
                    <span>Edison Admin</span>
                </div>
                <nav className="admin-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <button className="admin-nav-link" onClick={handleLogout} style={{ marginTop: 'auto' }}>
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
