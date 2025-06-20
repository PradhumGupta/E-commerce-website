import express from "express";
import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import stripe from "../config/stripe.js";
import { handleSuccessfulCheckout } from "../utils/checkout.js";

const router = express.Router();

router.post("/my-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        console.log("Event received: ", event)



        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            await handleSuccessfulCheckout(session);
            console.log("session: ", session)
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.log("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
})

export default router;