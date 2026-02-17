import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edison-sports-secret';

// Reference to the demo users store
declare global {
    var demoUsers: Map<string, { id: string; username: string; email: string; password: string; name: string; role: string }>;
}

if (!global.demoUsers) {
    global.demoUsers = new Map();
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            return NextResponse.json({
                user: {
                    id: decoded.id,
                    username: decoded.username,
                    role: decoded.role,
                    name: decoded.name,
                    email: decoded.email
                }
            });
        } catch (jwtError) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
