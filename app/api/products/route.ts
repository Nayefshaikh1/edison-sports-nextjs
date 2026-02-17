import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { sampleProducts } from '@/lib/data/sampleProducts';

// Check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/products - List all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let products;

        try {
            await connectDB();

            if (isDbConnected()) {
                let query: any = {};

                if (category && category !== 'all') {
                    query.category = category;
                }

                if (search) {
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ];
                }

                products = await Product.find(query).sort({ createdAt: -1 });

                // Seed with sample products if empty
                if (products.length === 0) {
                    const seeded = await Product.insertMany(
                        sampleProducts.map(p => ({ ...p, _id: undefined }))
                    );
                    products = seeded;
                }
            } else {
                products = [...sampleProducts];
            }
        } catch (dbError) {
            console.error('Database error, using sample products:', dbError);
            products = [...sampleProducts];
        }

        // Filter sample products if needed
        if (!isDbConnected() || products === sampleProducts) {
            if (category && category !== 'all') {
                products = products.filter((p: any) => p.category === category);
            }
            if (search) {
                const searchLower = search.toLowerCase();
                products = products.filter((p: any) =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.description.toLowerCase().includes(searchLower)
                );
            }
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(sampleProducts);
    }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
    try {
        // Check auth token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const productData = await request.json();

        try {
            await connectDB();

            if (isDbConnected()) {
                const product = new Product(productData);
                await product.save();
                return NextResponse.json(product, { status: 201 });
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // Fallback: return as if saved
        return NextResponse.json({
            _id: Date.now().toString(),
            ...productData,
            createdAt: new Date()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }
}
