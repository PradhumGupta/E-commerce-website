import mongoose, { mongo }  from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    image: {
        type: String,
        required: [true, "Product image is required"]
    },
    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Apparel", "Home Goods", "Books", "Sports & Outdoors", "Beauty & Personal Care"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;