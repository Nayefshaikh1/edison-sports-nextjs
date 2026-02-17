'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, Shield, RotateCcw, Headphones, Star, Quote, CheckCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import './page.css';

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

const REVIEWS = [
  {
    id: 1,
    name: 'Vikram Singh',
    avatar: 'VS',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    review: "Best boxing gloves I've ever used! The quality is exceptional and the fit is perfect. Edison Sports has become my go-to brand for all combat sports gear.",
    product: 'Pro Boxing Gloves',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: 'PS',
    location: 'Delhi',
    rating: 5,
    review: "The Karate Gi is exactly what I was looking for. Premium cotton, perfect stitching, and fits like a dream. Highly recommend for serious practitioners!",
    product: 'Traditional Karate Gi',
    verified: true,
    date: '1 month ago'
  },
  {
    id: 3,
    name: 'Arjun Patel',
    avatar: 'AP',
    location: 'Bangalore, Karnataka',
    rating: 5,
    review: "Fast shipping and excellent customer service. The MMA shorts are super comfortable and durable. Will definitely order again!",
    product: 'MMA Fighting Shorts',
    verified: true,
    date: '3 weeks ago'
  },
  {
    id: 4,
    name: 'Rahul Kumar',
    avatar: 'RK',
    location: 'Chennai, Tamil Nadu',
    rating: 4,
    review: "Great value for money! The heavy bag is solid and well-made. Perfect for home training. Only wish they had more color options.",
    product: 'Heavy Punching Bag',
    verified: true,
    date: '1 week ago'
  }
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#FFD700' : 'transparent'}
        stroke={i < rating ? '#FFD700' : '#404040'}
      />
    ));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <span className="hero__subtitle">🏆 India's Premium Combat Sports Brand</span>
            <h1 className="hero__title">
              Gear Up for <span className="text-gradient">Victory</span>
            </h1>
            <p className="hero__description">
              Professional-grade combat sports equipment trusted by champions. From boxing gloves to MMA gear, we provide the tools you need to train like a pro.
            </p>
            <div className="hero__buttons">
              <Link href="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={20} /> Shop Now
              </Link>
              <Link href="/products" className="btn btn-secondary btn-lg">Learn More</Link>
            </div>
            <div className="hero__stats">
              <div><div className="hero__stat-value">10K+</div><div className="hero__stat-label">Happy Athletes</div></div>
              <div><div className="hero__stat-value">500+</div><div className="hero__stat-label">Products</div></div>
              <div><div className="hero__stat-value">50+</div><div className="hero__stat-label">Gyms Trust Us</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by <span className="text-gradient">Sport</span></h2>
            <Link href="/products" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="category-card">
                <span className="category-card__icon">{cat.icon}</span>
                <span className="category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="text-gradient">Products</span></h2>
            <Link href="/products" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="reviews-section section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Customer <span className="text-gradient">Reviews</span></h2>
              <p className="reviews-section__subtitle">See what our champions are saying</p>
            </div>
            <div className="reviews-section__rating">
              <div className="reviews-section__stars">
                {renderStars(5)}
              </div>
              <span className="reviews-section__score">4.8/5</span>
              <span className="reviews-section__count">Based on 2,500+ reviews</span>
            </div>
          </div>

          <div className="reviews-grid">
            {REVIEWS.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">{review.avatar}</div>
                  <div className="review-card__author">
                    <div className="review-card__name">
                      {review.name}
                      {review.verified && (
                        <span className="review-card__verified">
                          <CheckCircle size={14} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="review-card__location">{review.location}</div>
                  </div>
                  <Quote size={24} className="review-card__quote" />
                </div>
                <div className="review-card__stars">
                  {renderStars(review.rating)}
                </div>
                <p className="review-card__text">{review.review}</p>
                <div className="review-card__footer">
                  <span className="review-card__product">Purchased: {review.product}</span>
                  <span className="review-card__date">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-item__icon"><Truck size={24} /></div>
              <h4>Free Shipping</h4>
              <p>On orders above ₹999</p>
            </div>
            <div className="trust-item">
              <div className="trust-item__icon"><Shield size={24} /></div>
              <h4>Quality Guarantee</h4>
              <p>Premium materials only</p>
            </div>
            <div className="trust-item">
              <div className="trust-item__icon"><RotateCcw size={24} /></div>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
            <div className="trust-item">
              <div className="trust-item__icon"><Headphones size={24} /></div>
              <h4>24/7 Support</h4>
              <p>Expert assistance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

