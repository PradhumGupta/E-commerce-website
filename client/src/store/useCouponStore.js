import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

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
    }
}))