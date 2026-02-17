import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

// In-memory store for reset tokens
const resetTokens = new Map<string, { code: string; expiresAt: number; userId?: string }>();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        let userId;
        try {
            await connectDB();
            const user = await User.findOne({ email });
            userId = user?._id;
        } catch (dbError) {
            console.error('Database error:', dbError);
        }

        // Generate reset code (6-digit)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Store reset token
        resetTokens.set(email, { code: resetCode, expiresAt, userId });

        console.log(`Password reset code for ${email}: ${resetCode}`);

        return NextResponse.json({
            message: 'If an account with this email exists, a reset code has been sent',
            // Include code in development for testing
            ...(process.env.NODE_ENV !== 'production' && { resetCode })
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
