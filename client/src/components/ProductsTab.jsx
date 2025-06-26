import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence for exit animations
import {
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  PackageIcon, // Icon for products
  PlusCircleIcon,
  StarIcon, // Icon for Add Product button
  XIcon
} from 'lucide-react';
import CreateProductForm from './CreateProductForm';
import { useProductStore } from '../store/useProductStore';
import { useEffect } from 'react';

// Framer Motion variants for modal backdrop
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Framer Motion variants for modal content
const modalVariants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: { y: "100vh", opacity: 0 },
};

function ProductsTab({ sectionVariants }) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { products, loading,  fetchAllProducts, deleteProduct, toggleFeaturedProduct } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Action handlers (dummy for now)
  const handleView = (productId) => {
    console.log(`View product: ${productId}`);
    // Implement logic to view product details, e.g., open a modal
  };

  const handleEdit = (productId) => {
    console.log(`Edit product: ${productId}`);
    // Implement logic to edit product, e.g., redirect to edit form
  };

  const handleDelete = async (productId) => {
    console.log(`Delete product: ${productId}`);
    // Implement logic to delete product, e.g., show confirmation modal then delete from DB
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };
  
  // New handler for toggling featured status
  const handleToggleFeature = async (productId) => {
    console.log(`Toggling featured status for product: ${productId}`);
    // In a real app, you would send an API request to update this product's status
    // and then update your local state/fetch new data.
    try {
      await toggleFeaturedProduct(productId);
    } catch (error) {
      console.error("Failed to add changes", error);
    }
  };

  return (
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-base-content">
          <PackageIcon className="size-6 text-primary" /> Products List
        </h3>
        <button
          className="btn btn-primary btn-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <PlusCircleIcon className="size-5" /> Add Product
        </button>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-base-300/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative card w-full max-w-2xl bg-base-100 shadow-xl border border-base-content/10 p-6"
              variants={modalVariants}
            >
              {/* Close Button */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowCreateForm(false)}
              >
                <XIcon className="size-5" />
              </button>

              <CreateProductForm 
                closeForm={() => setShowCreateForm(false)} // Pass the cancel handler 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <table className="table w-full rounded-box">
        {/* Table Head */}
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th className="rounded-tl-lg"></th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Featured</th>
            <th>Created At</th>
            <th className="rounded-tr-lg text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {products.length > 0 ? (
            products.map(product => (
              <tr key={product.id} className="text-base-content/90">
                <td>
                    <div className="mask mask-squircle w-16 h-16 bg-base-300 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={`${product.productName} thumbnail`}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/CCCCCC/000000?text=N/A"; }} // Fallback image
                        className="object-cover"
                      />
                    </div>
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.sales}</td>
                <td>
                  <button
                    onClick={() => handleToggleFeature(product._id)}
                    className={`btn btn-ghost btn-sm ${product.isFeatured ? 'text-warning' : 'text-base-content/50'} hover:text-warning transition-colors duration-200`}
                    aria-label={product.isFeatured ? "Unmark as featured" : "Mark as featured"}
                  >
                    <StarIcon className={`size-5 ${product.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </td>
                <td>{product.createdAt}</td>
                <td className="text-center">
                  {/* Action Menu (Dropdown) */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                      <MoreVerticalIcon className="size-4" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-content/10">
                      <li>
                        <a onClick={() => handleView(product._id)} className="flex items-center gap-2 text-base-content/80 hover:text-primary">
                          <EyeIcon className="size-4" /> View
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleEdit(product._id)} className="flex items-center gap-2 text-base-content/80 hover:text-warning">
                          <EditIcon className="size-4" /> Edit
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleDelete(product._id)} className="flex items-center gap-2 text-base-content/80 hover:text-error">
                          <Trash2Icon className="size-4" /> Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-8 text-base-content/70">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ProductsTab;
