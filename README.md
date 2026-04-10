# 🥊 Edison Sports Official

A full-stack e-commerce platform for combat sports equipment, built with **Next.js 16**, **MongoDB**, **Cloudinary**, and **Gemini AI**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Upload-blue?logo=cloudinary)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)

## ✨ Features

### 🛒 Customer Interface
- **Product Catalog** — Browse products by category (Boxing, MMA, Karate, Taekwondo, Judo, Fitness)
- **Product Detail Pages** — View product details with size/color selection
- **Shopping Cart** — Add to cart, update quantities, remove items
- **Checkout** — Complete order with customer details
- **User Authentication** — Sign up, login, forgot password with reset code
- **Account Management** — View profile and order history

### 🤖 AI Chatbot
- **Gemini AI-Powered** — Intelligent sports equipment assistant
- **Product Recommendations** — Get personalized gear suggestions
- **Real-time Chat** — Interactive conversation interface

### 🔐 Admin Dashboard
- **Dashboard Overview** — Revenue, orders, and product statistics
- **Product Management** — Add, edit, delete products with image upload (Cloudinary)
- **Order Management** — View and update order status
- **Inline Price Editing** — Quick-edit prices directly in the product table

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | CSS + Tailwind CSS |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT + bcrypt |
| **Image Storage** | Cloudinary |
| **AI** | Google Gemini API |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/edison-sports-nextjs.git
cd edison-sports-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/edison-sports
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access
- **Username:** `admin`
- **Password:** `edison2024`
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
edison-sports-nextjs/
├── app/
│   ├── api/                # API routes
│   │   ├── auth/           # Login, register, password reset
│   │   ├── chat/           # Gemini AI chatbot
│   │   ├── orders/         # Order CRUD
│   │   └── products/       # Product CRUD + image upload
│   ├── admin/              # Admin dashboard pages
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── login/              # Auth pages (login/register)
│   ├── products/           # Product listing & detail pages
│   ├── account/            # User account page
│   └── page.tsx            # Homepage
├── components/             # Reusable React components
├── context/                # React Context (Auth, Cart)
├── lib/                    # Database config & utilities
└── public/                 # Static assets
```

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User/Admin login |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Create product (Admin) |
| `PUT` | `/api/products/[id]` | Update product (Admin) |
| `DELETE` | `/api/products/[id]` | Delete product (Admin) |
| `POST` | `/api/products/upload` | Upload image to Cloudinary |
| `GET` | `/api/orders` | List orders |
| `POST` | `/api/orders` | Create order |
| `PUT` | `/api/orders/[id]` | Update order status (Admin) |
| `POST` | `/api/chat` | AI chatbot |

## 🌐 Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/edison-sports-nextjs)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by **Edison Sports Official**
