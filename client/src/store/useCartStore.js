import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: [],

    getCartItems: async () => {
        try {
            const res = await axios.get('/cart');
            console.log(res);
            set({ cart: res.data });
        } catch (error) {
            console.log("error", error)
            set({ cart: [] });
            toast.error(error.response.data.error || "An Error Occurred");
        }
    },

    addToCart: async (productId) => {
        try {
            const res = await axios.post('/cart', {productId});
            set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === productId);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, res.data];
				return { cart: newCart };
			});
            toast.success("Product added to Cart");
        } catch (error) {
            console.log("error", error)
            toast.error(error.response.data.error);
        }
    },
    removeItem: async (productId) => {
        try {
            const res = await axios.delete('/cart', { data: {productId} });
            console.log(res);
            set((prevState) => ({
                cart: prevState.cart.filter((item) => item._id !== productId)
            }))
        } catch (error) {
            console.log("Error on removing item", error)
            toast.error(error.response.data.error);
        }
    },
    updateItem: async (productId, quantity, price) => {
        try {
            const res = await axios.put('/cart', {productId, quantity, price});
            console.log(res);

            set((prevState) => {
                const newCart = prevState.cart.map((item) =>
							item._id === productId ? { ...item, quantity, total: quantity * price } : item
					  )
				return { cart: newCart };
            })
        } catch (error) {
            console.log("Error on updating quantity", error)
            toast.error(error.response.data.error);
        }
    }, 
    applyCouponCode: async (couponCode, currentOrderTotal) => {
        try {
            const res = await axios.post('/coupons/apply', { couponCode, currentOrderTotal });
            console.log(res);
            toast.success(res.data.message);
            return res.data.discountAmount;

        } catch (error) {
            console.log("Error on applying coupon", error)
            toast.error(error.response.data.error);
        }
    }
}))