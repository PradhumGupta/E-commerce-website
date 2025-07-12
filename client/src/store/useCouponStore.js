import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js"

export const useCouponStore = create((set, get) => ({
    allCoupons: [],
    myCoupons: [],
    loading: false,

    getAllCoupons: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/coupons');
            set({
                allCoupons: res.data,
                loading: false
            })
        } catch (error) {
            console.log("error", error)
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },

    getMyCoupons: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/coupons/owned');
            set({
                myCoupons: res.data,
                loading: false
            })
            console.log(res)
        } catch (error) {
            console.log("error", error);
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },

    createCoupon: async (couponData) => {
        set({ loading: true });

        try {
            const res = await axios.post('/coupons', couponData);
            set((prevState) => ({
                allCoupons: [...prevState.allCoupons, res.data.coupon],
                loading: false
            }))
            toast.success(res.data.message);
        } catch (error) {
            console.log("error", error)
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },
    claimCoupon: async (couponId) => {
        set({ loading: true });
        try {
            const res = await axios.post('/coupons/claim', {couponId});
            set((prevState) => ({
                myCoupons: [...prevState.myCoupons, res.data.coupon],
                loading: false
            }))
            toast.success(res.data.message);
        } catch (error) {
            console.log("error", error)
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },
    buyCoupon: async (type, couponId) => {
        try {
            const stripePromise = loadStripe("pk_test_51RVO8xRuT4deWCWRi3vZcymM1fW6S64WY9AP0PAb9wQoM5DQgvgS3TQ6Z5YryJaQQ7Pmy4FlSdkBcRUMobYGnTew00jAlPOmPI")
            const stripe = await stripePromise;

            const res = await axios.post("/payments/create-checkout-session", {
                type, items: [couponId]
            })

            const { id, url } = res.data;
            console.log(id, url)

            const result = await stripe.redirectToCheckout({sessionId: res.data.id})
        } catch (error) {
            console.log("Error in stripe payment", error)
            toast.error(error.response.data.error || error.response.data.message);
        }
    }
}))