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
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/products');
      set({ products: res.data.products, loading: false });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data, loading: false });
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  }, 
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((p) => p._id !== id),
        loading: false
      }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) => 
          product._id === id ? {...product, isFeatured: res.data.isFeatured } : product
      ),
        loading: false
      }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to feature product");
      set({ loading: false });
    }
  }
}));