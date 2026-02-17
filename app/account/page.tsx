'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut, Edit2, Save, X, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './account.css';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: number;
}

const SAMPLE_ORDERS: Order[] = [
    { id: '1', orderNumber: 'ORD-2024001', date: '2024-01-25', status: 'delivered', total: 5999, items: 2 },
    { id: '2', orderNumber: 'ORD-2024002', date: '2024-01-20', status: 'shipped', total: 2999, items: 1 },
    { id: '3', orderNumber: 'ORD-2024003', date: '2024-01-15', status: 'processing', total: 8499, items: 3 },
];

export default function AccountPage() {
    const router = useRouter();
    const { user, logout, isLoggedIn, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        }
    });
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, loading, router]);

    useEffect(() => {
        if (user) {
            // Load saved profile from localStorage or use defaults
            const savedProfile = localStorage.getItem(`profile_${user.id}`);
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            } else {
                setProfile({
                    name: user.name || '',
                    email: user.email || '',
                    phone: '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        pincode: ''
                    }
                });
            }
        }
    }, [user]);

    const handleSaveProfile = () => {
        if (user) {
            localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
            setIsEditing(false);
            setSavedMessage('Profile saved successfully!');
            setTimeout(() => setSavedMessage(''), 3000);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'status-delivered';
            case 'shipped': return 'status-shipped';
            case 'processing': return 'status-processing';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    if (loading) {
        return <div className="account-page"><div className="container"><div className="loading">Loading...</div></div></div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="account-page">
            <div className="container">
                <div className="account-layout">
                    {/* Sidebar */}
                    <aside className="account-sidebar">
                        <div className="account-user-card">
                            <div className="account-avatar">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="account-user-info">
                                <h3>{profile.name || 'User'}</h3>
                                <p>{profile.email}</p>
                            </div>
                        </div>

                        <nav className="account-nav">
                            <button
                                className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User size={20} /> My Profile
                            </button>
                            <button
                                className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <Package size={20} /> My Orders
                            </button>
                            <button
                                className={`account-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('addresses')}
                            >
                                <MapPin size={20} /> Addresses
                            </button>
                            <button
                                className={`account-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('wishlist')}
                            >
                                <Heart size={20} /> Wishlist
                            </button>
                            <button
                                className={`account-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <Settings size={20} /> Settings
                            </button>
                        </nav>

                        <button className="account-logout" onClick={handleLogout}>
                            <LogOut size={20} /> Logout
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className="account-main">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="account-section">
                                <div className="section-header">
                                    <h2>My Profile</h2>
                                    {!isEditing ? (
                                        <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>
                                            <Edit2 size={16} /> Edit
                                        </button>
                                    ) : (
                                        <div className="edit-actions">
                                            <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                                                <X size={16} /> Cancel
                                            </button>
                                            <button className="btn btn-primary btn-sm" onClick={handleSaveProfile}>
                                                <Save size={16} /> Save
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {savedMessage && <div className="success-message">{savedMessage}</div>}

                                <div className="profile-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><User size={16} /> Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Mail size={16} /> Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><Phone size={16} /> Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                placeholder="+91 XXXXX XXXXX"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="form-section-title"><MapPin size={18} /> Address</h3>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            value={profile.address.street}
                                            onChange={e => setProfile({
                                                ...profile,
                                                address: { ...profile.address, street: e.target.value }
                                            })}
                                            placeholder="House No, Building, Street"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                value={profile.address.city}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, city: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                value={profile.address.state}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, state: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>PIN Code</label>
                                            <input
                                                type="text"
                                                value={profile.address.pincode}
                                                onChange={e => setProfile({
                                                    ...profile,
                                                    address: { ...profile.address, pincode: e.target.value }
                                                })}
                                                maxLength={6}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="account-section">
                                <div className="section-header">
                                    <h2>My Orders</h2>
                                </div>

                                {SAMPLE_ORDERS.length === 0 ? (
                                    <div className="empty-state">
                                        <ShoppingBag size={60} />
                                        <h3>No orders yet</h3>
                                        <p>Start shopping to see your orders here</p>
                                        <Link href="/products" className="btn btn-primary">Shop Now</Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {SAMPLE_ORDERS.map(order => (
                                            <div key={order.id} className="order-card">
                                                <div className="order-header">
                                                    <div>
                                                        <span className="order-number">{order.orderNumber}</span>
                                                        <span className={`order-status ${getStatusColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <span className="order-date">
                                                        <Calendar size={14} /> {new Date(order.date).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className="order-body">
                                                    <div className="order-info">
                                                        <span><Package size={16} /> {order.items} item(s)</span>
                                                        <span><CreditCard size={16} /> {formatPrice(order.total)}</span>
                                                    </div>
                                                    <button className="btn btn-ghost btn-sm">View Details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="account-section">
                                <div className="section-header">
                                    <h2>Saved Addresses</h2>
                                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('profile')}>
                                        Add Address
                                    </button>
                                </div>

                                {profile.address.street ? (
                                    <div className="address-card">
                                        <div className="address-type">Home</div>
                                        <p>{profile.address.street}</p>
                                        <p>{profile.address.city}, {profile.address.state} - {profile.address.pincode}</p>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <MapPin size={60} />
                                        <h3>No addresses saved</h3>
                                        <p>Add an address to make checkout faster</p>
                                        <button className="btn btn-primary" onClick={() => setActiveTab('profile')}>
                                            Add Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="account-section">
                                <div className="section-header">
                                    <h2>My Wishlist</h2>
                                </div>
                                <div className="empty-state">
                                    <Heart size={60} />
                                    <h3>Your wishlist is empty</h3>
                                    <p>Save items you love for later</p>
                                    <Link href="/products" className="btn btn-primary">Browse Products</Link>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="account-section">
                                <div className="section-header">
                                    <h2>Account Settings</h2>
                                </div>

                                <div className="settings-list">
                                    <div className="settings-item">
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive order updates and promotions</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" defaultChecked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="settings-item">
                                        <div>
                                            <h4>SMS Notifications</h4>
                                            <p>Get delivery updates via SMS</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" defaultChecked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="settings-item danger">
                                        <div>
                                            <h4>Delete Account</h4>
                                            <p>Permanently delete your account and data</p>
                                        </div>
                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
