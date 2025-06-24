import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TagIcon, // For category
  DollarSignIcon, // For price
  FileUpIcon, // For image upload
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

// Framer Motion variants for form animations
const formVariants = {
  hidden: { opacity: 0, scaleY: 0, originY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    originY: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 120
    }
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    originY: 0,
    transition: {
      duration: 0.2
    }
  }
};

function CreateProductForm({ closeForm }) {

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null, // For storing the file object
  });

  const {loading, createProduct} = useProductStore();
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          image: reader.result // Store the base64 string of the image
        }));
      };
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('New product submitted:', formData);
    // Here you would typically send formData to your backend.
    // Reset form and hide it after submission (or on success from API)
    try {
      await createProduct(formData);
      closeForm();
    } catch (error) {
      console.error("Error creating product:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  const categories = [
    "Electronics", "Apparel", "Home Goods", "Books", "Sports & Outdoors", "Beauty & Personal Care"
  ];

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="card bg-base-100 shadow-lg border border-base-content/10 p-6 mb-8"
    >
      <h4 className="text-xl font-bold mb-4 text-base-content">Create New Product</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              Product Name
            </span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Wireless Bluetooth Earbuds"
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <DollarSignIcon className="size-4 text-primary" /> Price
            </span>
          </label>
          <input
            type="number"
            name="price"
            placeholder="e.g., 99.99"
            step="0.01"
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <TagIcon className="size-4 text-primary" /> Category
            </span>
          </label>
          <select
            name="category"
            className="select select-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <FileUpIcon className="size-4 text-primary" /> Product Image
            </span>
          </label>
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered w-full file-input-primary"
            onChange={handleFileChange}
            accept="image/*" // Only accept image files
          />
        </div>

        {/* Description (Full Width) */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              Description
            </span>
          </label>
          <textarea
            name="description"
            placeholder="A brief description of the product..."
            className="textarea textarea-bordered h-24 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        {/* Form Actions */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="btn btn-ghost text-base-content/70 hover:bg-base-200 transition-colors duration-200"
            onClick={closeForm} 
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner" />
                Logging In...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateProductForm;
