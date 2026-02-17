import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Edison Sports context for the AI
const SYSTEM_CONTEXT = `You are Edison, the friendly AI assistant for Edison Sports - India's Premium Combat Sports Brand.

About Edison Sports:
- We sell professional-grade combat sports equipment
- Categories: Boxing, MMA, Karate, Taekwondo, Judo, Wrestling, Muay Thai, Kickboxing, Fitness
- Located in India, ship across the country
- Contact: support@edisonsports.in, +91 98765 43210

Key Policies:
- Free shipping on orders above ₹2,000
- 30-day easy returns (products must be unused with original tags)
- Payment: Cards, UPI, Net Banking, Cash on Delivery
- Delivery: 3-7 business days across India

Popular Products:
- Pro Boxing Gloves: ₹2,999 - Premium leather, multi-layer foam, 8oz-16oz
- Heavy Punching Bag: ₹7,999 - Synthetic leather, high-density fill
- MMA Fighting Shorts: ₹1,499 - Lightweight, flexible
- Traditional Karate Gi: ₹2,499 - Premium cotton
- Taekwondo Electronic Gear

Guidelines:
- Be helpful, friendly, and professional
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly for friendliness
- If asked about specific orders, ask for order number
- For complex issues, recommend contacting support@edisonsports.in
- Always be positive about Edison Sports products`;

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // If no API key, use fallback responses
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return NextResponse.json({
                response: getFallbackResponse(message),
                mode: 'fallback'
            });
        }

        // Build conversation history for context
        const conversationHistory = history?.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        })) || [];

        // Add system context as first message
        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_CONTEXT }]
            },
            {
                role: 'model',
                parts: [{ text: 'I understand. I am Edison, the AI assistant for Edison Sports. I will help customers with product information, orders, shipping, returns, and any other questions about our combat sports equipment. How can I help you today?' }]
            },
            ...conversationHistory,
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ]
            })
        });

        if (!response.ok) {
            console.error('Gemini API error:', await response.text());
            return NextResponse.json({
                response: getFallbackResponse(message),
                mode: 'fallback'
            });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(message);

        return NextResponse.json({
            response: aiResponse,
            mode: 'gemini'
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({
            response: "I'm having trouble connecting right now. Please try again or contact support@edisonsports.in for assistance.",
            mode: 'error'
        });
    }
}

function getFallbackResponse(message: string): string {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
        return `Hello! 👋 Welcome to Edison Sports. I'm Edison, your AI assistant. How can I help you today?\n\nI can help with:\n• Product information\n• Order tracking\n• Shipping & returns\n• Size guides\n• Payment options`;
    }

    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
        return `📦 **Shipping Info:**\n• Delivery: 3-7 business days across India\n• Free shipping on orders above ₹2,000\n• Express delivery available (1-2 days, extra charges)`;
    }

    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
        return `↩️ **Returns Policy:**\n• 30-day easy return policy\n• Products must be unused with original tags\n• Free pickup for defective items\n• Refund processed within 7-10 business days`;
    }

    if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
        return `💳 **Payment Options:**\n• Credit/Debit Cards\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Cash on Delivery`;
    }

    if (lowerMsg.includes('contact') || lowerMsg.includes('support')) {
        return `📞 **Contact Us:**\n• Email: support@edisonsports.in\n• Phone: +91 98765 43210\n• Chat: I'm here 24/7!`;
    }

    return `Thanks for your message! I'm here to help with product info, orders, shipping, returns, and more.\n\nFor specific assistance, please describe what you need, or contact support@edisonsports.in`;
}
