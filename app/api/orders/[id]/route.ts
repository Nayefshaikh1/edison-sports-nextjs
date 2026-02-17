import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

const isDbConnected = () => mongoose.connection.readyState === 1;

// PUT /api/orders/[id] - Update order status
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        try {
            await connectDB();

            if (isDbConnected()) {
                const order = await Order.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );

                if (!order) {
                    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
                }

                return NextResponse.json(order);
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        return NextResponse.json({ _id: id, status });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
    }
}
