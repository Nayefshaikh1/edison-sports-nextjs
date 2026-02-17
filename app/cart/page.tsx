'use client';

import Link from 'next/link';
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import './cart.css';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');
    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + tax;

    const handleCheckout = async () => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerInfo: { name: 'Customer', email: 'customer@example.com' },
                    items: cart.map(item => ({
                        product: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color
                    })),
                    total
                })
            });
            const order = await res.json();
            clearCart();
            alert(`Order ${order.orderNumber} placed successfully!`);
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <ShoppingCart size={80} />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven&apos;t added anything yet</p>
                        <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping <span className="text-gradient">Cart</span></h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item__image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item__info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item__meta">
                                        {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                    </p>
                                    <div className="cart-item__price">{formatPrice(item.price)}</div>
                                </div>
                                <div className="cart-item__actions">
                                    <button className="cart-item__remove" onClick={() => removeFromCart(index)}>
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                        <div className="summary-row"><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
                        <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
                        <Link href="/checkout" className="btn btn-primary btn-lg checkout-btn">
                            <CreditCard size={20} /> Proceed to Checkout
                        </Link>
                        <Link href="/products" className="btn btn-ghost checkout-btn">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
