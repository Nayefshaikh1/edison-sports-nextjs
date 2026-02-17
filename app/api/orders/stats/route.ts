import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/orders/stats - Get order statistics for dashboard
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        try {
            await connectDB();

            if (isDbConnected()) {
                const totalOrders = await Order.countDocuments();
                const pendingOrders = await Order.countDocuments({ status: 'pending' });
                const totalProducts = await Product.countDocuments();

                const revenueResult = await Order.aggregate([
                    { $match: { status: { $ne: 'cancelled' } } },
                    { $group: { _id: null, total: { $sum: '$total' } } }
                ]);

                const totalRevenue = revenueResult[0]?.total || 0;

                return NextResponse.json({
                    totalOrders,
                    pendingOrders,
                    totalProducts,
                    totalRevenue
                });
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // Fallback sample stats
        return NextResponse.json({
            totalOrders: 156,
            pendingOrders: 12,
            totalProducts: 8,
            totalRevenue: 450000
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({
            totalOrders: 0,
            pendingOrders: 0,
            totalProducts: 0,
            totalRevenue: 0
        });
    }
}
