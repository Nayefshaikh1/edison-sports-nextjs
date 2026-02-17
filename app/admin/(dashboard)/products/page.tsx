'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    badge?: string;
    sizes?: string[];
    colors?: string[];
}

const CATEGORIES = [
    { id: 'boxing', name: 'Boxing' },
    { id: 'mma', name: 'MMA' },
    { id: 'karate', name: 'Karate' },
    { id: 'taekwondo', name: 'Taekwondo' },
    { id: 'judo', name: 'Judo' },
    { id: 'fitness', name: 'Fitness' }
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '', category: 'boxing', price: '', originalPrice: '', description: '', image: '', badge: '', sizes: '', colors: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', category: 'boxing', price: '', originalPrice: '', description: '', image: '', badge: '', sizes: '', colors: '' });
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: String(product.price),
            originalPrice: product.originalPrice ? String(product.originalPrice) : '',
            description: product.description,
            image: product.image,
            badge: product.badge || '',
            sizes: product.sizes?.join(', ') || '',
            colors: product.colors?.join(', ') || ''
        });
        setImagePreview(product.image);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    // Immediately remove from local state
                    setProducts(prev => prev.filter(p => p._id !== id));
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const productData = {
            ...formData,
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice) || Number(formData.price),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
            image: formData.image || 'https://via.placeholder.com/400x400?text=Product'
        };

        try {
            if (editingProduct) {
                await fetch(`/api/products/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(productData)
                });
            } else {
                await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(productData)
                });
            }
            setShowModal(false);
            loadProducts();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save product');
        }
    };

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Products</h1>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Badge</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <img src={product.image} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>{product.badge || '-'}</td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="admin-btn edit" onClick={() => openEditModal(product)} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="admin-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="image-upload" onClick={() => document.getElementById('image-input')?.click()}>
                                    <input type="file" id="image-input" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                setImagePreview(ev.target?.result as string);
                                                setFormData(prev => ({ ...prev, image: ev.target?.result as string }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={48} />
                                            <p>Click to upload image</p>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Image URL (optional)</label>
                                    <input type="url" value={formData.image} onChange={e => { setFormData(prev => ({ ...prev, image: e.target.value })); setImagePreview(e.target.value); }} placeholder="https://..." />
                                </div>

                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}>
                                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Badge</label>
                                        <input type="text" value={formData.badge} onChange={e => setFormData(prev => ({ ...prev, badge: e.target.value }))} placeholder="e.g. Bestseller" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹) *</label>
                                        <input type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} required min="1" />
                                    </div>
                                    <div className="form-group">
                                        <label>Original Price (₹)</label>
                                        <input type="number" value={formData.originalPrice} onChange={e => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Sizes (comma separated)</label>
                                        <input type="text" value={formData.sizes} onChange={e => setFormData(prev => ({ ...prev, sizes: e.target.value }))} placeholder="S, M, L, XL" />
                                    </div>
                                    <div className="form-group">
                                        <label>Colors (comma separated)</label>
                                        <input type="text" value={formData.colors} onChange={e => setFormData(prev => ({ ...prev, colors: e.target.value }))} placeholder="Red, Black, Blue" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
