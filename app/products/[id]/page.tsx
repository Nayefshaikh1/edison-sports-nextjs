'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, Star, ThumbsUp, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import './product-detail.css';

interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
    helpful: number;
}

const SAMPLE_REVIEWS: Review[] = [
    {
        id: 1,
        name: 'Amit Sharma',
        rating: 5,
        date: '2 weeks ago',
        title: 'Excellent quality!',
        comment: 'This product exceeded my expectations. The quality is top-notch and it fits perfectly. Highly recommend for serious fighters!',
        verified: true,
        helpful: 24
    },
    {
        id: 2,
        name: 'Priya Patel',
        rating: 4,
        date: '1 month ago',
        title: 'Great value for money',
        comment: 'Good product overall. Delivery was fast and packaging was excellent. Only minor issue is the sizing runs a bit small.',
        verified: true,
        helpful: 18
    },
    {
        id: 3,
        name: 'Rajesh Kumar',
        rating: 5,
        date: '3 weeks ago',
        title: 'Professional grade equipment',
        comment: 'Been training for 10 years and this is one of the best I\'ve used. Edison Sports never disappoints!',
        verified: true,
        helpful: 32
    }
];

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
    features?: string[];
    rating?: number;
    reviews?: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [reviews] = useState<Review[]>(SAMPLE_REVIEWS);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            setProduct(data);
            if (data.sizes?.length) setSelectedSize(data.sizes[0]);
            if (data.colors?.length) setSelectedColor(data.colors[0]);

            // Load related products
            const relatedRes = await fetch(`/api/products?category=${data.category}`);
            const relatedData = await relatedRes.json();
            setRelated(relatedData.filter((p: Product) => p._id !== id).slice(0, 4));
        } catch (error) {
            console.error('Failed to load product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity, selectedSize, selectedColor);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');

    const renderStars = (rating: number, interactive = false) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={interactive ? 24 : 16}
                fill={i < rating ? '#FFD700' : 'transparent'}
                stroke={i < rating ? '#FFD700' : '#404040'}
                style={interactive ? { cursor: 'pointer' } : {}}
                onClick={interactive ? () => setNewReview({ ...newReview, rating: i + 1 }) : undefined}
            />
        ));
    };

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    if (loading) return <div className="product-page"><div className="container"><div className="loading">Loading...</div></div></div>;
    if (!product) return <div className="product-page"><div className="container"><div className="loading">Product not found</div></div></div>;

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link href="/">Home</Link> / <Link href="/products">Products</Link> / <span>{product.name}</span>
                </nav>

                <div className="product-detail">
                    <div className="product-gallery">
                        <div className="product-main-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-info">
                        {product.badge && <span className="product-badge">{product.badge}</span>}
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-rating-summary">
                            <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
                            <span className="rating-score">{averageRating.toFixed(1)}</span>
                            <span className="rating-count">({reviews.length} reviews)</span>
                        </div>

                        <div className="product-price-box">
                            <span className="product-price">{formatPrice(product.price)}</span>
                            {discount > 0 && (
                                <>
                                    <span className="product-old-price">{formatPrice(product.originalPrice!)}</span>
                                    <span className="product-discount">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="option-group">
                                <span className="option-label">Size</span>
                                <div className="option-values">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >{size}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.colors && product.colors.length > 0 && (
                            <div className="option-group">
                                <span className="option-label">Color</span>
                                <div className="option-values">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >{color}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="add-to-cart-section">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className={`btn btn-primary btn-lg ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                                {added ? <><CheckCircle size={20} /> Added!</> : <><ShoppingCart size={20} /> Add to Cart</>}
                            </button>
                        </div>

                        {product.features && product.features.length > 0 && (
                            <div className="product-features">
                                <h3>Features</h3>
                                <div className="features-list">
                                    {product.features.map((f, i) => (
                                        <div key={i} className="feature-item"><CheckCircle size={18} /> {f}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="reviews-section">
                    <div className="reviews-header">
                        <div>
                            <h2>Customer Reviews</h2>
                            <div className="reviews-summary">
                                <div className="reviews-overall">
                                    <span className="overall-score">{averageRating.toFixed(1)}</span>
                                    <div className="overall-stars">{renderStars(Math.round(averageRating))}</div>
                                    <span className="overall-count">Based on {reviews.length} reviews</span>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowReviewForm(!showReviewForm)}>
                            Write a Review
                        </button>
                    </div>

                    {showReviewForm && (
                        <div className="review-form">
                            <h3>Write Your Review</h3>
                            <div className="form-group">
                                <label>Your Rating</label>
                                <div className="rating-input">{renderStars(newReview.rating, true)}</div>
                            </div>
                            <div className="form-group">
                                <label>Review Title</label>
                                <input
                                    type="text"
                                    placeholder="Summarize your experience"
                                    value={newReview.title}
                                    onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea
                                    placeholder="Tell others what you think about this product"
                                    rows={4}
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={() => { setShowReviewForm(false); alert('Review submitted!'); }}>
                                Submit Review
                            </button>
                        </div>
                    )}

                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-item__header">
                                    <div className="review-item__avatar">
                                        <User size={20} />
                                    </div>
                                    <div className="review-item__author">
                                        <span className="author-name">
                                            {review.name}
                                            {review.verified && <span className="verified-badge"><CheckCircle size={14} /> Verified</span>}
                                        </span>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                </div>
                                <div className="review-item__rating">{renderStars(review.rating)}</div>
                                <h4 className="review-item__title">{review.title}</h4>
                                <p className="review-item__comment">{review.comment}</p>
                                <div className="review-item__actions">
                                    <button className="helpful-btn">
                                        <ThumbsUp size={16} /> Helpful ({review.helpful})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {related.length > 0 && (
                    <section className="related-products">
                        <h2>Related <span className="text-gradient">Products</span></h2>
                        <div className="products-grid">
                            {related.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

