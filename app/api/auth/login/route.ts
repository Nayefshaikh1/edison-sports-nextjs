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
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        // Admin credentials (always works)
        if (username === 'admin' && password === 'edison2024') {
            const token = jwt.sign(
                { id: 'admin', username: 'admin', role: 'admin', name: 'Administrator', email: 'admin@edisonsports.com' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            return NextResponse.json({
                token,
                user: { id: 'admin', username: 'admin', role: 'admin', name: 'Administrator', email: 'admin@edisonsports.com' }
            });
        }

        // Try MongoDB first
        const dbAvailable = await initDB();

        if (dbAvailable && User) {
            try {
                const user = await User.findOne({
                    $or: [{ username }, { email: username }]
                });

                if (user) {
                    const isMatch = await user.comparePassword(password);
                    if (isMatch) {
                        const token = jwt.sign(
                            { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        return NextResponse.json({
                            token,
                            user: { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email }
                        });
                    } else {
                        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
                    }
                }
            } catch (dbError) {
                console.error('Database error, trying demo mode:', dbError);
                // Fall through to demo mode
            }
        }

        // Demo mode fallback
        let foundUser = global.demoUsers.get(username);

        if (!foundUser) {
            for (const [, user] of global.demoUsers) {
                if (user.email === username) {
                    foundUser = user;
                    break;
                }
            }
        }

        if (!foundUser) {
            return NextResponse.json({ message: 'User not found. Please register first.' }, { status: 401 });
        }

        if (foundUser.password !== password) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        const token = jwt.sign(
            { id: foundUser.id, username: foundUser.username, role: foundUser.role, name: foundUser.name, email: foundUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            token,
            user: { id: foundUser.id, username: foundUser.username, role: foundUser.role, name: foundUser.name, email: foundUser.email },
            mode: 'demo'
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
    }
}
