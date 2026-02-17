import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edison-sports-secret';

// In-memory user store for demo/fallback mode
declare global {
    var demoUsers: Map<string, { id: string; username: string; email: string; password: string; name: string; role: string }>;
}

if (!global.demoUsers) {
    global.demoUsers = new Map();
    global.demoUsers.set('demo', {
        id: 'demo-user-1',
        username: 'demo',
        email: 'demo@edisonsports.in',
        password: 'demo123',
        name: 'Demo User',
        role: 'customer'
    });
}

// Try to import MongoDB models
let connectDB: any = null;
let User: any = null;
let useDatabase = false;

async function initDB() {
    if (connectDB !== null) return useDatabase;

    try {
        const dbModule = await import('@/lib/db');
        const userModule = await import('@/lib/models/User');
        connectDB = dbModule.default;
        User = userModule.default;

        await connectDB();
        useDatabase = true;
        console.log('MongoDB connected for auth');
    } catch (error) {
        console.log('MongoDB not available, using demo mode');
        useDatabase = false;
    }
    return useDatabase;
}

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, name } = await request.json();

        // Validate required fields
        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
        }

        // Try MongoDB first
        const dbAvailable = await initDB();

        if (dbAvailable && User) {
            try {
                // Check if user exists in database
                const existingUser = await User.findOne({
                    $or: [{ username }, { email }]
                });

                if (existingUser) {
                    return NextResponse.json({ message: 'User with this username or email already exists' }, { status: 400 });
                }

                // Create new user in database
                const user = new User({
                    username,
                    email,
                    password,
                    name: name || username,
                    role: 'customer'
                });

                await user.save();

                const token = jwt.sign(
                    { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return NextResponse.json({
                    token,
                    user: { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email }
                }, { status: 201 });
            } catch (dbError: any) {
                console.error('Database error, falling back to demo mode:', dbError.message);
                // Fall through to demo mode
            }
        }

        // Demo mode fallback
        for (const [, user] of global.demoUsers) {
            if (user.username === username) {
                return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
            }
            if (user.email === email) {
                return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
            }
        }

        const newUser = {
            id: 'user-' + Date.now(),
            username,
            email,
            password,
            name: name || username,
            role: 'customer'
        };

        global.demoUsers.set(username, newUser);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            token,
            user: { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name, email: newUser.email },
            mode: 'demo'
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
    }
}
