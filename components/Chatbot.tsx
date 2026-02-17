'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap } from 'lucide-react';
import './Chatbot.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hello! 👋 I'm Edison, your AI assistant powered by Gemini. I'm here 24/7 to help you!

How can I assist you today?`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        const userInput = input.trim();
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Call Gemini AI API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInput,
                    history: messages.slice(-10) // Send last 10 messages for context
                })
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || "I'm having trouble responding. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again or contact support@edisonsports.in for assistance.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = [
        'What products do you sell?',
        'Shipping information',
        'Returns policy',
        'Size guide for gloves'
    ];

    const handleQuickAction = (action: string) => {
        setInput(action);
        setTimeout(() => {
            const fakeEvent = { key: 'Enter', shiftKey: false, preventDefault: () => { } } as React.KeyboardEvent;
            handleKeyPress(fakeEvent);
        }, 100);
    };

    return (
        <div className="chatbot">
            {/* Chat Button */}
            <button
                className={`chatbot__trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open chat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && <span className="chatbot__trigger-badge">AI</span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot__window">
                    <div className="chatbot__header">
                        <div className="chatbot__header-info">
                            <div className="chatbot__avatar">
                                <Bot size={24} />
                                <span className="online-dot"></span>
                            </div>
                            <div>
                                <h4>Edison AI <Zap size={14} className="ai-badge" /></h4>
                                <span className="chatbot__status">
                                    <Sparkles size={12} /> Powered by Gemini
                                </span>
                            </div>
                        </div>
                        <button className="chatbot__close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot__messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chatbot__message ${msg.role}`}>
                                <div className="chatbot__message-avatar">
                                    {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                                </div>
                                <div className="chatbot__message-content">
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chatbot__message assistant">
                                <div className="chatbot__message-avatar">
                                    <Bot size={18} />
                                </div>
                                <div className="chatbot__typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 2 && (
                        <div className="chatbot__quick-actions">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickAction(action)}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chatbot__input">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || isTyping}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
