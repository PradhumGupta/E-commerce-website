import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVerticalIcon, // For the action menu
  EyeIcon,          // View icon
  EditIcon,         // Edit icon
  Trash2Icon,       // Delete icon
  ShoppingBagIcon,  // Icon for product type
  GiftIcon          // Icon for coupon type
} from 'lucide-react';
import ProductOrders from './ProductOrders';
import CouponOrders from './CouponOrders';

// Dummy Data for Orders
const dummyOrders = [
  {
    id: 'ORD001',
    user: 'Alice Smith',
    itemType: 'Product',
    itemName: 'Wireless Headphones',
    price: 120.00,
    purchasedAt: '2024-06-19 14:30',
    details: { productId: 'P001', quantity: 1 }
  },
  {
    id: 'ORD002',
    user: 'Bob Johnson',
    itemType: 'Coupon',
    itemName: '20% Off Electronics',
    price: 10.00, // Price for the coupon itself if it's sold
    purchasedAt: '2024-06-18 09:15',
    details: { couponCode: 'ELECTRO20', discount: '20%', validUntil: '2024-12-31' }
  },
  {
    id: 'ORD003',
    user: 'Charlie Brown',
    itemType: 'Product',
    itemName: 'Smartwatch',
    price: 250.00,
    purchasedAt: '2024-06-17 18:00',
    details: { productId: 'P002', quantity: 1 }
  },
  {
    id: 'ORD004',
    user: 'Diana Prince',
    itemType: 'Product',
    itemName: 'Ergonomic Keyboard',
    price: 85.50,
    purchasedAt: '2024-06-16 11:45',
    details: { productId: 'P003', quantity: 1 }
  },
  {
    id: 'ORD005',
    user: 'Eve Adams',
    itemType: 'Coupon',
    itemName: 'Free Shipping Voucher',
    price: 0.00,
    purchasedAt: '2024-06-15 16:20',
    details: { couponCode: 'FREESHIP', minOrder: 50 }
  },
  {
    id: 'ORD006',
    user: 'Frank White',
    itemType: 'Product',
    itemName: 'Portable Bluetooth Speaker',
    price: 60.00,
    purchasedAt: '2024-06-14 10:00',
    details: { productId: 'P004', quantity: 2 }
  },
];

function OrdersTab({ sectionVariants }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'products', 'coupons'

  // Filter orders based on the active tab
  const filteredOrders = dummyOrders.filter(order => {
    if (activeTab === 'all') {
      return true;
    }
    return order.itemType.toLowerCase() === activeTab.slice(0, -1); // e.g., 'products' -> 'product'
  });

  // Action handlers (dummy for now)
  const handleView = (orderId) => {
    console.log(`View order: ${orderId}`);
    // Implement logic to view order details, e.g., open a modal
  };

  const handleEdit = (orderId) => {
    console.log(`Edit order: ${orderId}`);
    // Implement logic to edit order, e.g., redirect to edit form
  };

  const handleDelete = (orderId) => {
    console.log(`Delete order: ${orderId}`);
    // Implement logic to delete order, e.g., show confirmation modal then delete from DB
  };

  return (
    <>
      <h2 className="card-title text-3xl font-bold mb-6 text-center md:text-left
        bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Orders Management
      </h2>

      {/* Tabs for All, Products, Coupons */}
      <div role="tablist" className="tabs mb-6 p-1 gap-1.5 rounded-lg">
        <a
          role="tab"
          className={`tab transition-colors duration-200 text-base-content/80 rounded-2xl ${activeTab === 'all' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </a>
        <a
          role="tab"
          className={`tab transition-colors duration-200 text-base-content/80 rounded-2xl ${activeTab === 'product' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveTab('product')}
        >
          Products
        </a>
        <a
          role="tab"
          className={`tab transition-colors duration-200 text-base-content/80 rounded-2xl ${activeTab === 'coupon' ? 'tab-active !text-primary !bg-base-300 shadow-inner' : 'hover:bg-base-300/50'}`}
          onClick={() => setActiveTab('coupon')}
        >
          Coupons
        </a>
      </div>

      {/* Conditional Content based on activeTab */}
      {activeTab === 'all' && (
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="overflow-x-auto">
          <table className="table w-full table-zebra rounded-box">
            {/* Table Head */}
            <thead>
              <tr className="bg-base-300 text-base-content">
                <th className="rounded-tl-lg">Order ID</th>
                <th>User</th>
                <th>Item Type</th>
                <th>Item Name</th> {/* Added Item Name column */}
                <th>Price</th>
                <th>Purchased At</th>
                <th className="rounded-tr-lg text-center">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="text-base-content/90">
                    <td>{order.id}</td>
                    <td>{order.user}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {order.itemType === 'Product' ? <ShoppingBagIcon className="size-4 text-accent" /> : <GiftIcon className="size-4 text-info" />}
                        {order.itemType}
                      </div>
                    </td>
                    <td>{order.itemName}</td> {/* Display Item Name */}
                    <td>${order.price.toFixed(2)}</td>
                    <td>{order.purchasedAt}</td>
                    <td className='text-center'>
                      {/* Action Menu (Dropdown) */}
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                          <MoreVerticalIcon className="size-4" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-content/10">
                          <li>
                            <a onClick={() => handleView(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-primary">
                              <EyeIcon className="size-4" /> View
                            </a>
                          </li>
                          <li>
                            <a onClick={() => handleEdit(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-warning">
                              <EditIcon className="size-4" /> Edit
                            </a>
                          </li>
                          <li>
                            <a onClick={() => handleDelete(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-error">
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
                    No orders found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Placeholders for Products and Coupons Tabs */}
      {activeTab === 'product' && (
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="text-base-content/70 p-4 text-center">
          <ProductOrders sectionVariants={sectionVariants} />
        </motion.div>
      )}

      {activeTab === 'coupon' && (
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="text-base-content/70 p-4 text-center">
          <CouponOrders sectionVariants={sectionVariants} />
        </motion.div>
      )}
    </>
  );
}

export default OrdersTab;
