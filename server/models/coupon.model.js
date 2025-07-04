import mongoose from "mongoose";

const couponCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate codes
    },
    used: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    reservedAt: {
        type: Date,
        default: null
    }
});

couponCodeSchema.methods.isReserved = function() {
    return this.reservedBy !== null && this.reservedAt !== null && !this.used
}

const purchasedBySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    purchasedAt: {
        type: Date,
        default: null,
    },
});

const couponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    isFree: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        min: [0, 'Purchase price cannot be negative.'],
        required: true
    },
    discountType: {
        type: String,
        required: [true, 'Discount type is required.'],
        enum: {
            values: ['percent', 'flat'],
            message: 'Discount type must be either "percent" or "flat".'
        },
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required.'],
        min: [0, 'Discount value cannot be negative.'],
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order amount cannot be negative.'],
    },
    maxDiscountAmount: {
        type: Number,
        min: [0, 'Maximum discount amount cannot be negative.'],
        required: function() {
            return this.discountType === 'percentage';
        },
        message: 'Max discount amount is required for percentage-based coupons.'
    },
    codes: [couponCodeSchema],
    purchasedBy: [purchasedBySchema],
    expiryDate: {
        type: Date,
        required: [true, "Expiry date is required"],
    },
    usageLimitPerUser: {
        type: Number,
        min: [1, 'Usage limit per user must be at least 1.'],
        default: null, // null means no limit per user
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'Used count cannot be negative.'],
    },
    category: {
        type: String,
        enum: ["Electronics", "Apparel", "Home Goods", "Books", "Sports & Outdoors", "Beauty & Personal Care"],
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

couponSchema.pre('save', function(next) {
    if (this.discountType === 'percentage' && (this.discountValue < 0 || this.discountValue > 100)) {
        return next(new Error('Percentage discount value must be between 0 and 100.'));
    }
    next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;

// later add cron job for unreserving code if purchase fails, isActive to false if coupon expires