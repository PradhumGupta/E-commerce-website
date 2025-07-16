import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    type: {
        type: String,
        enum: ["product", "coupon"],
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }, 
            quantity: {
                type: Number,
                min: 1
            },
            price: {
                type: Number,
                min: 0
            }, 
        },
    ],
    coupon: 
    {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        code: {
            type: String
        },
        price: {
            type: Number,
            min: 0
        },
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    stripeSessionId: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;