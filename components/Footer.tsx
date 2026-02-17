'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    {/* Brand Section */}
                    <div className="footer__brand">
                        <Link href="/" className="footer__logo">
                            <span className="logo-icon">🏆</span>
                            <span className="logo-text">Edison <span className="text-gradient">Sports</span></span>
                        </Link>
                        <p className="footer__tagline">
                            India&apos;s Premium Combat Sports Brand. Professional-grade equipment trusted by champions worldwide.
                        </p>
                        <div className="footer__social">
                            <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="social-link" aria-label="Youtube"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/products">Products</Link></li>
                            <li><Link href="/products?category=boxing">Boxing</Link></li>
                            <li><Link href="/products?category=mma">MMA</Link></li>
                            <li><Link href="/products?category=karate">Karate</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer__links">
                        <h4>Support</h4>
                        <ul>
                            <li><Link href="#">FAQs</Link></li>
                            <li><Link href="#">Shipping Info</Link></li>
                            <li><Link href="#">Returns</Link></li>
                            <li><Link href="#">Size Guide</Link></li>
                            <li><Link href="#">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer__contact">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>123 Sports Complex, Mumbai, India</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} />
                            <span>support@edisonsports.in</span>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {currentYear} Edison Sports. All rights reserved.</p>
                    <div className="footer__legal">
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
