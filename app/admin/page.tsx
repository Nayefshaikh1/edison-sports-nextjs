'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './admin.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login(credentials.username, credentials.password);
            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-logo">🏆</div>
                    <h1>Admin Portal</h1>
                    <p>Edison Sports Management</p>
                </div>

                {error && <div className="admin-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-icon">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Enter admin username"
                                value={credentials.username}
                                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-icon">
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg admin-submit" disabled={loading}>
                        {loading ? 'Signing in...' : <>Sign In <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div className="admin-demo-hint">
                    <p>Demo: <code>admin</code> / <code>edison2024</code></p>
                </div>
            </div>
        </div>
    );
}
