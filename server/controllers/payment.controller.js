import Coupon from "../models/coupon.model.js";
import stripe from "../config/stripe.js";
import { CLIENT_URL } from "../config/env.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { createProductLineItems } from "../utils/checkout.js";

export const createCheckoutSession = async (req, res) => {
    const { type, items, appliedCoupon } = req.body;

    try {
        let lineItems = [];
        let metadata = { userId: req.user._id.toString(), type };

        if (type === "product") {
            lineItems = createProductLineItems(items, appliedCoupon)
            console.log(lineItems)
            metadata.itemIds = items.map(item => item._id.toString()).join(",");
            metadata.appliedCouponCode = appliedCoupon?.code;
        }

        if (type === "coupon") {
            const couponId = items[0];

            if (!couponId) return res.status(400).json({ message: "Coupon ID is required" });

            const coupon = await Coupon.findById(couponId); 
            if (!coupon) return res.status(404).json({ message: "Coupon not found" });

            const availableCode = coupon.codes.find(c => c.user === null);
            if (!availableCode)
                return res.status(400).json({ message: "No available codes" });

            availableCode.reservedAt = new Date();

            lineItems = [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: coupon.title, images: [coupon.image] },
                        unit_amount: coupon.price * 100,
                    },
                    quantity: 1,
                },
            ];
            metadata.couponId = coupon._id.toString();
            metadata.code = availableCode.code;
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: req.user.email,
            success_url: `${CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/purchase-cancel`,
            metadata,
        });

        let tempOrder;
        if(type === "product") {
            tempOrder = new Order({
                user: req.user._id,
                type: type,
                products: req.user.cartItems || [],
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id
            })
        } else {
            tempOrder = new Order({
                user: req.user._id,
                type: type,
                coupon: { id: metadata.couponId, code: metadata.code, price: lineItems[0].price_data.unit_amount / 100 },
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id
            })
        }
        metadata.tempOrderId = tempOrder._id.toString();

        res.json({ id: session.id, url: session.url });

    } catch (err) {
        console.error("Purchase error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid") {

            const order = await Order.find({ sessionId: session.id })

            res.status(200).json({ success: true, message: "Payment successful", orderId: order._id, orderType: order.type });
        } else {
            res.json({ success: false, message: "Payment Pending" });
        }

    } catch (error) {
        console.log("Error processing successful checkout", error.message);
        res.status(500).json({ message: 'Error processing successful checkout', error });
    }
}
