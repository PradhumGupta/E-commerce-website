import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const createProductLineItems = (items, coupon) => {
    return items.map(item => {
        const discountedAmount = coupon && item.category === coupon.category  ? coupon.discountAmount / item.quantity : 0;
        const amount = (item.price - discountedAmount) * 100;

        return {
            price_data: {
                currency: "usd",
                product_data: { name: item.name, images: [item.image] },
                unit_amount: amount > 0 ? Math.round(amount) : 0
            },
            quantity: item.quantity,
        }
    })
    // return products.map(p => {
    //     const item = user.cartItems.find(item => item.product.toString() === p._id.toString());
    //     const discountedAmount = discountAmount ? discountAmount / products.length : 0;
    //     const amount = (p.price - discountedAmount) * 100;
    //     return {
    //         price_data: {
    //             currency: "usd",
    //             product_data: { name: p.name },
    //             unit_amount: amount > 0 ? Math.round(amount) : 0
    //         },
    //         quantity: item ? item.quantity : 1,
    //     }
    // });
}

export const handleSuccessfulCheckout = async (session) => {
    try {
        const userId = session.metadata.userid;

        if (session.metadata.type === "coupon") {
            const coupon = await Coupon.findById(session.metadata.couponId);
            const code = coupon.codes.find(c => c.code === session.metadata.code);
            if (code && !code.user) {
                code.user = userId;
                code.reservedAt = new Date();
                await coupon.save();
            }

            const user = await User.findById(userId);
            user.ownedCoupons.push({
                coupon: coupon._id,
                code: code.code,
                purchasedAt: new Date(),
                isFree: false
            });
            await user.save();
        }

        if (session.metadata.type === "product") {
            const order = await Order.findById(session.metadata.tempOrderId);
            if (!order) {
                console.error("Order not found for session:", session.id);
                return;
            }
            await order.save();
            
            const user = await User.findById(userId);
            user.cartItems = [];
            await user.save();
            req.user.cartItems = [];
            console.log("Order saved successfully:", order._id);
            
            if(session.metadata.appliedCouponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.appliedCouponCode, userId: session.metadata.userId
                }, {
                    isActive: false
                })
            }
        }
    } catch (err) {
        console.log("Error in handleSuccessfulCheckout:", err.message);
    }
};
