'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import './products.css';

const CATEGORIES = [
    { id: 'all', name: 'All Products' },
    { id: 'boxing', name: 'Boxing' },
    { id: 'mma', name: 'MMA' },
    { id: 'karate', name: 'Karate' },
    { id: 'taekwondo', name: 'Taekwondo' },
    { id: 'judo', name: 'Judo' },
    { id: 'fitness', name: 'Fitness' }
];

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
    rating?: number;
    reviews?: number;
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [sort, setSort] = useState('default');

    useEffect(() => {
        // Update search from URL when params change
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params = category !== 'all' ? `?category=${category}` : '';
            const res = await fetch(`/api/products${params}`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'price-low') return a.price - b.price;
            if (sort === 'price-high') return b.price - a.price;
            if (sort === 'name') return a.name.localeCompare(b.name);
            return 0;
        });

    const handleCategoryChange = (catId: string) => {
        setCategory(catId);
        const url = new URL(window.location.href);
        if (catId !== 'all') {
            url.searchParams.set('category', catId);
        } else {
            url.searchParams.delete('category');
        }
        window.history.replaceState({}, '', url.toString());
    };

    return (
        <div className="products-page">
            <div className="container">
                <div className="products-header">
                    <h1>Our <span className="text-gradient">Products</span></h1>
                    <p>Professional combat sports equipment for every fighter</p>
                </div>

                <div className="products-layout">
                    <aside className="filters-sidebar">
                        <div className="filter-group">
                            <h3><Search size={18} /> Categories</h3>
                            <div className="filter-list">
                                {CATEGORIES.map(cat => (
                                    <label
                                        key={cat.id}
                                        className={`filter-item ${category === cat.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="products-area">
                        <div className="products-toolbar">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="products-sort">
                                <span className="products-count">{filteredProducts.length} products</span>
                                <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                                    <option value="default">Sort by: Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading">Loading products...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="no-products">No products found</div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="products-page"><div className="container"><div className="loading">Loading products...</div></div></div>}>
            <ProductsContent />
        </Suspense>
    );
}
