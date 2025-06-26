import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  GiftIcon, // Icon for coupon itself
  PercentIcon, // For percent discount type
  DollarSignIcon, // For flat discount type
  PlusCircleIcon, // For add codes
  KeyIcon,
  XIcon, // For code input
} from 'lucide-react';
import CreateCouponForm from './CreateCouponForm';

// Dummy Data for Coupons
const dummyCoupons = [
  {
    id: 'CUP001',
    title: 'Summer Sale 20%',
    discountType: 'percent', // Can be 'percent' or 'flat'
    discountValue: 20, // 20%
    price: 0.00, // Coupons can be free or sold
    category: 'Seasonal',
    totalCodes: 100,
    purchasedCodes: 55,
    createdAt: '2024-05-01 09:00',
  },
  {
    id: 'CUP002',
    title: 'Flat $10 Off',
    discountType: 'flat',
    discountValue: 10, // $10
    price: 0.00,
    category: 'Electronics',
    totalCodes: 50,
    purchasedCodes: 20,
    createdAt: '2024-05-10 14:00',
  },
  {
    id: 'CUP003',
    title: 'Holiday Special 15%',
    discountType: 'percent',
    discountValue: 15,
    price: 5.00,
    category: 'Apparel',
    totalCodes: 200,
    purchasedCodes: 180,
    createdAt: '2024-06-01 11:30',
  },
  {
    id: 'CUP004',
    title: 'Weekend Mega Savings',
    discountType: 'flat',
    discountValue: 25,
    price: 0.00,
    category: 'All Products',
    totalCodes: 75,
    purchasedCodes: 10,
    createdAt: '2024-06-15 16:00',
  },
];


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

function CouponsTab({ sectionVariants }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'percent', 'flat'
  const [codesToAdd, setCodesToAdd] = useState({}); // State to hold input for 'add codes' for each coupon
  const [showCreateForm, setShowCreateForm] = useState(false); 
  // Filter coupons based on the active filter
  const filteredCoupons = dummyCoupons.filter(coupon => {
    if (activeFilter === 'all') {
      return true;
    }
    return coupon.discountType === activeFilter;
  });

  // Handler for individual 'add codes' input change
  const handleAddCodesInputChange = (couponId, value) => {
    setCodesToAdd(prev => ({
      ...prev,
      [couponId]: value
    }));
  };

  // Handler for 'Generate' button click
  const handleGenerateCodes = (couponId, amount) => {
    console.log(`Generating ${amount} codes for coupon: ${couponId}`);
    // In a real application, you would send an API request here
    // to generate codes and update the totalCodes/purchasedCodes.
    // Reset the input after generating
    setCodesToAdd(prev => {
      const newState = { ...prev };
      delete newState[couponId];
      return newState;
    });
  };

  // Action handlers (dummy for now)
  const handleView = (couponId) => {
    console.log(`View coupon: ${couponId}`);
  };

  const handleEdit = (couponId) => {
    console.log(`Edit coupon: ${couponId}`);
  };

  const handleDelete = (couponId) => {
    console.log(`Delete coupon: ${couponId}`);
  };

  return (
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="overflow-x-auto">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-base-content">
        <GiftIcon className="size-6 text-primary" /> Coupon Management
      </h3>

      <div className="flex justify-between items-center mb-6">
        {/* Filter Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 rounded-lg shadow-sm w-fit mx-auto md:mx-0">
        <a
          role="tab"
          className={`tab flex-grow transition-colors duration-200 text-base-content/80 ${activeFilter === 'all' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </a>
        <a
          role="tab"
          className={`tab flex-grow transition-colors duration-200 text-base-content/80 ${activeFilter === 'percent' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveFilter('percent')}
        >
          <PercentIcon className="size-4" /> Percent
        </a>
        <a
          role="tab"
          className={`tab flex-grow transition-colors duration-200 text-base-content/80 ${activeFilter === 'flat' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveFilter('flat')}
        >
          <DollarSignIcon className="size-4" /> Flat
        </a>
      </div>
        <button
          className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <PlusCircleIcon className="size-5" /> Add Coupon
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
              className="relative card w-full max-w-3xl bg-base-100 shadow-xl border border-base-content/10 p-6"
              variants={modalVariants}
            >
              {/* Close Button */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowCreateForm(false)}
              >
                <XIcon className="size-5" />
              </button>

              <CreateCouponForm 
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
            <th className="rounded-tl-lg">ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Category</th>
            <th>Total Codes</th>
            <th>Purchased Codes</th>
            <th>Add Codes</th>
            <th>Created At</th>
            <th className="rounded-tr-lg text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(coupon => (
              <tr key={coupon.id} className="text-base-content/90">
                <td>{coupon.id}</td>
                <td>{coupon.title}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {coupon.discountType === 'percent' ? <PercentIcon className="size-4 text-accent" /> : <DollarSignIcon className="size-4 text-info" />}
                    {coupon.discountType}
                  </div>
                </td>
                <td>${coupon.price.toFixed(2)}</td>
                <td>{coupon.category}</td>
                <td>{coupon.totalCodes}</td>
                <td>{coupon.purchasedCodes}</td>
                <td>
                  {/* Add Codes Input & Button */}
                  <div className="flex flex-col gap-1 items-start"> {/* Use flex-col and items-start */}
                    <input
                      type="number"
                      placeholder="Qty"
                      className="input input-bordered input-xs w-20"
                      value={codesToAdd[coupon.id] || ''}
                      onChange={(e) => handleAddCodesInputChange(coupon.id, e.target.value)}
                      min="1"
                    />
                    <button
                      className="btn btn-primary btn-xs flex items-center gap-1 mt-1"
                      onClick={() => handleGenerateCodes(coupon.id, codesToAdd[coupon.id] || 0)}
                      disabled={!codesToAdd[coupon.id] || codesToAdd[coupon.id] <= 0}
                    >
                      <PlusCircleIcon className="size-3" /> Generate
                    </button>
                  </div>
                </td>
                <td>{coupon.createdAt}</td>
                <td className="text-center">
                  {/* Action Menu (Dropdown) */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                      <MoreVerticalIcon className="size-4" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-content/10">
                      <li>
                        <a onClick={() => handleView(coupon.id)} className="flex items-center gap-2 text-base-content/80 hover:text-primary">
                          <EyeIcon className="size-4" /> View
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleEdit(coupon.id)} className="flex items-center gap-2 text-base-content/80 hover:text-warning">
                          <EditIcon className="size-4" /> Edit
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleDelete(coupon.id)} className="flex items-center gap-2 text-base-content/80 hover:text-error">
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
              <td colSpan="10" className="text-center py-8 text-base-content/70">
                No coupons found for this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default CouponsTab;
