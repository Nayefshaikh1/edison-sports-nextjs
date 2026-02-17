'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './Navbar.css';

const CATEGORIES = [
    { id: 'boxing', name: 'Boxing', icon: '🥊' },
    { id: 'mma', name: 'MMA', icon: '🤼' },
    { id: 'karate', name: 'Karate', icon: '🥋' },
    { id: 'taekwondo', name: 'Taekwondo', icon: '🦶' },
    { id: 'judo', name: 'Judo', icon: '🤸' },
    { id: 'wrestling', name: 'Wrestling', icon: '💪' },
    { id: 'muay-thai', name: 'Muay Thai', icon: '🇹🇭' },
    { id: 'kickboxing', name: 'Kickboxing', icon: '🦵' },
    { id: 'fitness', name: 'Fitness', icon: '🏋️' }
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
    ];

    return (
        <header className="navbar">
            <div className="container">
                <div className="navbar__inner">
                    <div className="navbar__left">
                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link href="/" className="navbar__logo">
                            <span className="logo-icon">🏆</span>
                            <span className="logo-text">Edison <span className="text-gradient">Sports</span></span>
                        </Link>
                    </div>

                    <nav className={`navbar__nav ${mobileMenuOpen ? 'open' : ''}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Categories Dropdown */}
                        <div
                            className="nav-dropdown"
                            onMouseEnter={() => setCategoriesOpen(true)}
                            onMouseLeave={() => setCategoriesOpen(false)}
                        >
                            <button className="nav-link nav-dropdown__trigger" onClick={() => setCategoriesOpen(!categoriesOpen)}>
                                Categories <ChevronDown size={16} />
                            </button>
                            <div className={`nav-dropdown__menu ${categoriesOpen ? 'open' : ''}`}>
                                {CATEGORIES.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.id}`}
                                        className="nav-dropdown__item"
                                        onClick={() => { setCategoriesOpen(false); setMobileMenuOpen(false); }}
                                    >
                                        <span className="nav-dropdown__icon">{cat.icon}</span>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile-only Auth Links */}
                        <div className="mobile-auth-section">
                            {mounted && (user ? (
                                <>
                                    <Link
                                        href="/account"
                                        className="nav-link mobile-auth-link"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={18} /> My Account
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="nav-link mobile-auth-link admin-link"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            🛡️ Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        className="nav-link mobile-auth-link logout-link"
                                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="nav-link mobile-auth-link"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={18} /> Login
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="mobile-register-btn"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Create Account
                                    </Link>
                                </>
                            ))}
                        </div>
                    </nav>

                    {/* Search Bar */}
                    <form className={`navbar__search ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
                        <Search size={18} className="navbar__search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </form>

                    <div className="navbar__actions">
                        {mounted && (user ? (
                            <div className="navbar__user">
                                <Link href="/account" className="user-account-link">
                                    <div className="user-avatar-mini">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="user-name">{user.name || user.username}</span>
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin/dashboard" className="btn btn-sm btn-ghost">
                                        Admin
                                    </Link>
                                )}
                                <button onClick={logout} className="btn btn-sm btn-ghost" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-sm btn-primary">
                                <User size={18} /> Login
                            </Link>
                        ))}

                        <Link href="/cart" className="navbar__cart">
                            <ShoppingCart size={22} />
                            {mounted && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;


