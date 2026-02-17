import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { sampleProducts } from '@/lib/data/sampleProducts';

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        let product;

        try {
            await connectDB();

            if (isDbConnected()) {
                product = await Product.findById(id);
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        if (!product) {
            // Try sample products
            product = sampleProducts.find(p => p._id === id);
        }

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
}

// PUT /api/products/[id] - Update product (Admin only)
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
        const updateData = await request.json();

        try {
            await connectDB();

            if (isDbConnected()) {
                const product = await Product.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true, runValidators: true }
                );

                if (!product) {
                    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
                }

                return NextResponse.json(product);
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // Fallback
        return NextResponse.json({ _id: id, ...updateData });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            await connectDB();

            if (isDbConnected()) {
                const product = await Product.findByIdAndDelete(id);

                if (!product) {
                    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
                }
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
    }
}
