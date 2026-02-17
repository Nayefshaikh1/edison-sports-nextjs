'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string | null;
    color: string | null;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity?: number, size?: string | null, color?: string | null) => void;
    updateQuantity: (index: number, quantity: number) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart');
            if (saved) {
                try {
                    setCart(JSON.parse(saved));
                } catch {
                    setCart([]);
                }
            }
            setIsInitialized(true);
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (product: any, quantity = 1, size: string | null = null, color: string | null = null) => {
        setCart(prev => {
            const existing = prev.findIndex(item =>
                item.productId === product._id && item.size === size && item.color === color
            );

            if (existing !== -1) {
                const updated = [...prev];
                updated[existing].quantity += quantity;
                return updated;
            }

            return [...prev, {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity,
                size,
                color
            }];
        });
    };

    const updateQuantity = (index: number, quantity: number) => {
        setCart(prev => {
            if (quantity <= 0) {
                return prev.filter((_, i) => i !== index);
            }
            const updated = [...prev];
            updated[index].quantity = quantity;
            return updated;
        });
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
