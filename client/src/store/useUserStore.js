import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signUp: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if(password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ user: res.data, loading: false })
        } catch(error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured during signup")
        }
    },

    logIn: async ({ email, password }) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data, loading: false })
        } catch(error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured during signup")
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout")
            set({ user: null })
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured during logout")
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const res = await axios.get("/auth/profile");
            set({ user: res.data, checkingAuth: false })
        } catch (error) {
            set({ checkingAuth: false, user: null })
        }
    }
}))