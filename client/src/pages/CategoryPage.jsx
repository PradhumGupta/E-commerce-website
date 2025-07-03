import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import {
  TagIcon, // For category icons in sidebar
  LayoutGridIcon, // For "All Products" icon
} from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import LoadingSpinner from "../components/LoadingSpinner";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  // Reusing for sidebar entrance
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category"); // Get category from URL query param

  // Categories for sidebar navigation (normalized for linking)
  const allCategories = [
    { name: "All Products", param: "all", icon: LayoutGridIcon },
    { name: "Electronics", param: "electronics", icon: TagIcon },
    { name: "Apparel", param: "apparel", icon: TagIcon },
    { name: "Home Goods", param: "home-goods", icon: TagIcon },
    { name: "Books", param: "books", icon: TagIcon },
    { name: "Sports & Outdoors", param: "sports-outdoors", icon: TagIcon },
    {
      name: "Beauty & Personal Care",
      param: "beauty-personal-care",
      icon: TagIcon,
    },
  ];

  const [CategoryName, setCategoryName] = useState("All Products");
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");

  const { products, loading, fetchProductsByCategory, fetchAllProducts } = useProductStore();

  useEffect(() => {
    const currentActiveParam = categoryParam || "all"; // Use URL param or default to 'all'

    // Update sidebar active state based on URL param
    setActiveCategory(currentActiveParam);

    const category =
      currentActiveParam === "all"
        ? "All Products"
        : allCategories.find((cat) => cat.param === currentActiveParam)?.name ||
          "All Products";

    setCategoryName(category);

    if(category === "All Products") {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(category);
    }
  }, [categoryParam, fetchProductsByCategory, fetchAllProducts]); 

  const handleCategoryClick = async (category) => {
    // Update the URL query parameter
    if (category === "all") {
      setSearchParams({}); // Remove category param for 'All Products'
    } else {
      setSearchParams({ category });
    }
    setActiveCategory(category); // Update local state for immediate feedback
  };

  return (
    <motion.div
      className="min-h-screen max-w-7xl mx-auto flex flex-col lg:flex-row bg-base-200 py-10 px-4" // Use flex for side-by-side layout
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar Navigation */}
      <motion.div
        className="lg:w-64 lg:border-r lg:border-b-0 p-6 flex flex-col gap-2 lg:min-h-[calc(100vh-8rem)] lg:sticky lg:top-20 mb-6 lg:mb-0"
        variants={sectionVariants} // Apply entrance animation to sidebar
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-4 mx-2 text-base-content">
          Explore
        </h2>
        <ul className="p-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden gap-4 justify-between">
          {allCategories.map((cat) => (
            <li key={cat.param} className="flex flex-col items-center flex-shrink-0">
              <a
                className={`flex max-lg:flex-col items-center gap-3 text-base-content ${
                  activeCategory === cat.param
                    ? "active !text-primary !bg-primary/20"
                    : "hover:bg-base-200"
                }`}
                onClick={() => handleCategoryClick(cat.param)}
              >
                {cat.icon && <cat.icon className="size-5" />} {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <h1
          className="text-3xl md:text-4xl lg:text-center font-bold mb-12
          bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        >
          {CategoryName}
        </h1>
        {!loading && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : loading ? (
          <div className="relative flex justify-center items-center mt-16"> {/* Adjust height as needed */}
            <LoadingSpinner />
          </div>
        ) : (
          <div className="text-center text-base-content/70 mt-16 text-xl">
            No products found in the "{CategoryName}" category.
            <br />
            <Link
              to="/"
              className="link link-hover text-primary mt-4 inline-block"
            >
              Explore other categories
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CategoryPage;
