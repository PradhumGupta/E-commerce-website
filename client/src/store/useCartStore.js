import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: [],
    orderSummary: {},
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axios.get('/cart');
            console.log(res);
            set({ cart: res.data });
            get().calculateOrderSummary(get().cart);
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
    applyCoupon: async (couponCode, currentOrderTotal) => {
        try {
            const res = await axios.post('/coupons/apply', { couponCode, currentOrderTotal });
            toast.success(res.data.message);

            set((prevState) => {
                const obj = prevState.orderSummary;
                obj.discount = res.data.discountAmount;
                obj.total -= obj.discount;
                return { orderSummary: obj, coupon: res.data.appliedCoupon, isCouponApplied: true };
            })

        } catch (error) {
            console.log("Error on applying coupon", error)
            toast.error(error.response.data.error || error.response.data.message);
        }
    },
    calculateOrderSummary: (items) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const shipping = subtotal > 100 ? 0 : 7.99; // Free shipping over $100
        const taxRate = 0.08; // 8% tax
        const tax = subtotal * taxRate;
        const total = subtotal + shipping + tax;

        set(() => ({
            orderSummary: { subtotal, shipping, tax, total }
        }));
    }
}))