import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: String,
    color: String
});

const orderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String,
        address: String
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
