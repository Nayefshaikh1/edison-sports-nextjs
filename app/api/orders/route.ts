import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Sample orders for demo
const sampleOrders = [
    {
        _id: '1',
        orderNumber: 'ES-001',
        customerInfo: { name: 'John Doe', email: 'john@example.com', phone: '9876543210' },
        items: [{ product: '1', name: 'Pro Boxing Gloves', price: 2999, quantity: 1, size: '12oz', color: 'Red' }],
        total: 3539,
        status: 'completed',
        createdAt: new Date('2024-01-15')
    },
    {
        _id: '2',
        orderNumber: 'ES-002',
        customerInfo: { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211' },
        items: [{ product: '2', name: 'MMA Fighting Shorts', price: 1499, quantity: 2, size: 'L', color: 'Black/Red' }],
        total: 3537,
        status: 'processing',
        createdAt: new Date('2024-01-20')
    }
];

let nextOrderNum = 3;

// GET /api/orders - List all orders (Admin)
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let orders;

        try {
            await connectDB();

            if (isDbConnected()) {
                orders = await Order.find().sort({ createdAt: -1 });
                if (orders.length === 0) {
                    orders = sampleOrders;
                }
            } else {
                orders = sampleOrders;
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
            orders = sampleOrders;
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(sampleOrders);
    }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    try {
        const orderData = await request.json();

        const orderNumber = `ES-${String(nextOrderNum++).padStart(3, '0')}`;

        try {
            await connectDB();

            if (isDbConnected()) {
                const order = new Order({
                    ...orderData,
                    orderNumber,
                    status: 'pending'
                });
                await order.save();
                return NextResponse.json(order, { status: 201 });
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // Fallback
        return NextResponse.json({
            _id: Date.now().toString(),
            orderNumber,
            ...orderData,
            status: 'pending',
            createdAt: new Date()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
    }
}
