import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TagIcon,          // For category
  DollarSignIcon,    // For price/flat discount
  LayersIcon,        // For number of totalCodes
  FileUpIcon,        // For image upload
  PercentIcon,       // For percent type
  PaletteIcon,       // For title
  TextIcon,          // For description
  ShoppingCartIcon,
  TicketPercent,
  TicketPercentIcon,  // For min order amount
} from 'lucide-react';
import { useCouponStore } from '../store/useCouponStore';

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

function CreateCouponForm({ closeForm }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percent', // Default to percent
    maxDiscountAmount: '',
    price: '', 
    category: '',
    discountValue: '',
    minOrderAmount: '',
    totalCodes: '',
    image: null,
  });

  const categories = [
    "Electronics", "Apparel", "Home Goods", "Books", "Sports & Outdoors", "Beauty & Personal Care", "Seasonal", "All Products"
  ];

  const { loading, createCoupon } = useCouponStore();

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
    console.log('New coupon submitted:', formData);
    
    await createCoupon(formData);

    setFormData({
      title: '',
      description: '',
      discountType: 'percent',
      maxDiscountAmount: '',
      price: '',
      category: '',
      discountValue: '',
      minOrderAmount: '',
      totalCodes: '',
      image: null,
    });

    closeForm();
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h4 className="text-xl font-bold mb-4 text-base-content">Create New Coupon</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <PaletteIcon className="size-4 text-primary" /> Title
            </span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Weekend Flash Sale"
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Discount Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              Type
            </span>
          </label>
          <select
            name="discountType"
            className="select select-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.discountType}
            onChange={handleChange}
            required
          >
            <option value="percent">Percent (%)</option>
            <option value="flat">Flat ($)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              Discount Value
            </span>
          </label>
          <input
            type="number"
            name="discountValue"
            placeholder={formData.discountType === 'percent' ? "e.g., 15" : "e.g., 10.00"}
            step={formData.discountType === 'percent' ? "1" : "0.01"}
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.discountValue}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* Max Discount Amount (Conditional for Percent Type) */}
        {formData.discountType === 'percent' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                <TicketPercentIcon className="size-4 text-primary" /> Max Discount Amount
              </span>
            </label>
            <input
              type="number"
              name="maxDiscountAmount"
              placeholder="e.g., 50.00"
              step="0.01"
              className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              min="0"
            />
          </div>
        )}

        {/* Price (Is Free Checkbox and Price Input) */}
        <div className="form-control">
                <label className="label">
                    <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                        <DollarSignIcon className="size-4 text-primary" /> Price
                    </span>
                </label>
                <input
                    type="number"
                    name="price"
                    placeholder="e.g., 5.00"
                    step="0.01"
                    className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
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

        {/* Min Order Amount */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <ShoppingCartIcon className="size-4 text-primary" /> Min. Order Amount
            </span>
          </label>
          <input
            type="number"
            name="minOrderAmount"
            placeholder="e.g., 100.00"
            step="0.01"
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.minOrderAmount}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Number of totalCodes */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <LayersIcon className="size-4 text-primary" /> Amount of totalCodes
            </span>
          </label>
          <input
            type="number"
            name="totalCodes"
            placeholder="e.g., 100"
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.totalCodes}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {/* Image Upload */}
        <div className="form-control col-span-1 md:col-span-2 lg:col-span-3"> {/* Span full width for better placement */}
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <FileUpIcon className="size-4 text-primary" /> Coupon Image (Optional)
            </span>
          </label>
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered w-full file-input-primary"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {/* Description (Full Width) */}
        <div className="form-control col-span-1 md:col-span-2 lg:col-span-3">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
              <TextIcon className="size-4 text-primary" /> Description
            </span>
          </label>
          <textarea
            name="description"
            placeholder="A brief description of the coupon..."
            className="textarea textarea-bordered h-24 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-6">
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
          >
            {loading ? (
              <>
                <span className="loading loading-spinner" />
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateCouponForm;
