'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft, Smartphone, Building } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import './checkout.css';

type PaymentMethod = 'card' | 'upi' | 'cod' | 'netbanking';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [address, setAddress] = useState({
        fullName: user?.name || '',
        phone: '',
        email: user?.email || '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        if (cart.length === 0 && !orderPlaced) {
            router.push('/cart');
        }
    }, [cart, orderPlaced, router]);

    const tax = Math.round(cartTotal * 0.18);
    const shipping = cartTotal > 2000 ? 0 : 99;
    const total = cartTotal + tax + shipping;

    const formatPrice = (price: number) => '₹' + price.toLocaleString('en-IN');

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerInfo: {
                        name: address.fullName,
                        email: address.email,
                        phone: address.phone
                    },
                    shippingAddress: address,
                    items: cart.map(item => ({
                        product: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        image: item.image
                    })),
                    paymentMethod,
                    subtotal: cartTotal,
                    tax,
                    shipping,
                    total
                })
            });

            const order = await res.json();
            setOrderId(order.orderNumber || 'ORD' + Date.now());
            setOrderPlaced(true);
            clearCart();
            setStep(3);
        } catch (error) {
            console.error('Order failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">
                            <CheckCircle size={80} />
                        </div>
                        <h1>Order Placed Successfully! 🎉</h1>
                        <p className="order-id">Order ID: <strong>{orderId}</strong></p>
                        <p className="success-message">
                            Thank you for shopping with Edison Sports! Your order has been confirmed
                            and you will receive an email confirmation shortly.
                        </p>
                        <div className="success-actions">
                            <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
                            <Link href="/" className="btn btn-ghost">Go to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <Link href="/cart" className="back-link">
                    <ArrowLeft size={20} /> Back to Cart
                </Link>

                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <div className="checkout-steps">
                        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Shipping</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Payment</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Confirm</span>
                        </div>
                    </div>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        {step === 1 && (
                            <div className="checkout-section">
                                <h2><Truck size={24} /> Shipping Address</h2>
                                <form onSubmit={handleAddressSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                value={address.fullName}
                                                onChange={e => setAddress({ ...address, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                value={address.phone}
                                                onChange={e => setAddress({ ...address, phone: e.target.value })}
                                                placeholder="+91 XXXXX XXXXX"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={address.email}
                                            onChange={e => setAddress({ ...address, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Street Address *</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={e => setAddress({ ...address, street: e.target.value })}
                                            placeholder="House No, Building, Street, Area"
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={e => setAddress({ ...address, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                value={address.state}
                                                onChange={e => setAddress({ ...address, state: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>PIN Code *</label>
                                            <input
                                                type="text"
                                                value={address.pincode}
                                                onChange={e => setAddress({ ...address, pincode: e.target.value })}
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        Proceed to Payment
                                    </button>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout-section">
                                <h2><CreditCard size={24} /> Payment Method</h2>

                                <div className="payment-methods">
                                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                        />
                                        <CreditCard size={24} />
                                        <span>Credit/Debit Card</span>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'upi'}
                                            onChange={() => setPaymentMethod('upi')}
                                        />
                                        <Smartphone size={24} />
                                        <span>UPI</span>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'netbanking' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'netbanking'}
                                            onChange={() => setPaymentMethod('netbanking')}
                                        />
                                        <Building size={24} />
                                        <span>Net Banking</span>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                        />
                                        <Truck size={24} />
                                        <span>Cash on Delivery</span>
                                    </label>
                                </div>

                                <form onSubmit={handlePayment}>
                                    {paymentMethod === 'card' && (
                                        <div className="card-form">
                                            <div className="form-group">
                                                <label>Card Number</label>
                                                <input
                                                    type="text"
                                                    value={cardDetails.number}
                                                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Name on Card</label>
                                                <input
                                                    type="text"
                                                    value={cardDetails.name}
                                                    onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Expiry (MM/YY)</label>
                                                    <input
                                                        type="text"
                                                        value={cardDetails.expiry}
                                                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>CVV</label>
                                                    <input
                                                        type="password"
                                                        value={cardDetails.cvv}
                                                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                        placeholder="•••"
                                                        maxLength={4}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <div className="upi-form">
                                            <div className="form-group">
                                                <label>UPI ID</label>
                                                <input
                                                    type="text"
                                                    value={upiId}
                                                    onChange={e => setUpiId(e.target.value)}
                                                    placeholder="yourname@upi"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'netbanking' && (
                                        <div className="netbanking-info">
                                            <p>You will be redirected to your bank&apos;s website to complete the payment securely.</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="cod-info">
                                            <p>Pay with cash when your order is delivered. Additional ₹50 COD charges apply.</p>
                                        </div>
                                    )}

                                    <div className="checkout-buttons">
                                        <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                                            Back
                                        </button>
                                        <button type="submit" className="btn btn-primary btn-lg" disabled={processing}>
                                            {processing ? 'Processing...' : `Pay ${formatPrice(total + (paymentMethod === 'cod' ? 50 : 0))}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cart.map((item, i) => (
                                    <div key={i} className="summary-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="summary-item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                                <div className="summary-row"><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
                                {paymentMethod === 'cod' && (
                                    <div className="summary-row"><span>COD Charges</span><span>{formatPrice(50)}</span></div>
                                )}
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>{formatPrice(total + (paymentMethod === 'cod' ? 50 : 0))}</span>
                                </div>
                            </div>
                        </div>

                        <div className="trust-badges">
                            <div className="trust-badge">
                                <Shield size={20} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="trust-badge">
                                <Truck size={20} />
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
