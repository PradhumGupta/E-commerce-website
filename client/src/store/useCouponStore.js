import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCouponStore = create((set, get) => ({
    coupons: [],
    loading: false,

    setCoupons: (coupons) => set({ coupons }),

    createCoupon: async (couponData) => {
        set({ loading: true });

        try {
            const res = await axios.post('/coupons', couponData);
            set((prevState) => ({
                coupons: [...prevState.coupons, res.data.coupon],
                loading: false
            }))
            toast.success(res.data.message);
        } catch (error) {
            console.log("error", error)
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    }
}))