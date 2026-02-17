import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    badge?: string;
    sizes: string[];
    colors: string[];
    features: string[];
    rating: number;
    reviews: number;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['boxing', 'mma', 'karate', 'taekwondo', 'judo', 'wrestling', 'muay-thai', 'kickboxing', 'fitness']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x400?text=Product'
    },
    badge: {
        type: String,
        default: null
    },
    sizes: [{
        type: String
    }],
    colors: [{
        type: String
    }],
    features: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
