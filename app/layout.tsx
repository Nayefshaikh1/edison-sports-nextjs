import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edison Sports - Premium Combat Sports Equipment",
  description: "India's Premium Combat Sports Brand. Professional-grade boxing, MMA, karate, taekwondo gear trusted by champions.",
  keywords: "boxing gloves, MMA gear, karate, taekwondo, sports equipment, combat sports, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Chatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


