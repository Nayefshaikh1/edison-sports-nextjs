'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import './ProductCard.css';

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

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, null, null);
    };

    return (
        <Link href={`/products/${product._id}`} className="product-card">
            <div className="product-card__image">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="product-card__badge">{product.badge}</span>}
                {discount > 0 && <span className="product-card__discount">-{discount}%</span>}
            </div>
            <div className="product-card__content">
                <span className="product-card__category">{product.category}</span>
                <h3 className="product-card__name">{product.name}</h3>
                {product.rating !== undefined && (
                    <div className="product-card__rating">
                        <Star size={14} fill="#FFD700" stroke="#FFD700" />
                        <span>{product.rating}</span>
                        <span className="reviews">({product.reviews} reviews)</span>
                    </div>
                )}
                <div className="product-card__price">
                    <span className="current">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
                <button className="product-card__cta" onClick={handleAddToCart}>
                    <ShoppingCart size={18} /> Add to Cart
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
