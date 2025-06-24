import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const res = await axios.post('/products', productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false
      }))
      toast.success("Product added successfully");
    } catch (error) {
      console.log("error", error)
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  }
}));