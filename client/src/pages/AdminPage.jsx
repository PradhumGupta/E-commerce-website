import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  PackageIcon,
  GiftIcon,
  UsersIcon
} from 'lucide-react';
import AnalyticsTab from '../components/AnalyticsTab';
import OrdersTab from '../components/OrdersTab';
import ProductsTab from '../components/ProductsTab';
import CouponsTab from '../components/CouponsTab';

// Framer Motion variants for page entry
const pageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

// Framer Motion variants for content sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard'); // State to control active content

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="card bg-base-100 shadow-xl border border-base-content/10 p-6 min-h-[calc(100vh-10rem)]">
            <AnalyticsTab />
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="card bg-base-100 shadow-xl border border-base-content/10 p-6">
            <OrdersTab sectionVariants={sectionVariants} />
          </motion.div>
        );
      case 'products':
        return (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="card bg-base-100 shadow-xl border border-base-content/10 p-6">
            <ProductsTab sectionVariants={sectionVariants} />
          </motion.div>
        );
      case 'coupons':
        return (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="card bg-base-100 shadow-xl border border-base-content/10 p-6">
            <CouponsTab sectionVariants={sectionVariants} />
          </motion.div>
        );
      case 'users':
        return (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="card bg-base-100 shadow-xl border border-base-content/10 p-6">
            <h3 className="card-title text-2xl font-bold mb-4 flex items-center gap-2">
              <UsersIcon className="size-6 text-primary" /> User Management
            </h3>
            <p className="text-base-content/70">Manage user accounts and roles. (Content to be designed later)</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-4rem)] flex bg-base-200"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar Navigation */}
      <motion.div
        className="w-64 bg-base-100 shadow-lg border-r border-base-content/10 p-6 flex flex-col gap-2"
        variants={sectionVariants} // Apply entrance animation to sidebar
      >
        <h2 className="text-xl font-bold mb-4 text-base-content">Admin Panel</h2>
        <ul className="menu bg-base-100 w-full rounded-box p-0">
          <li>
            <a
              className={`flex items-center gap-3 text-base-content ${activeSection === 'dashboard' ? 'active !text-primary !bg-primary/20' : 'hover:bg-base-200'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <LayoutDashboardIcon className="size-5" /> Dashboard
            </a>
          </li>
          <li>
            <a
              className={`flex items-center gap-3 text-base-content ${activeSection === 'orders' ? 'active !text-primary !bg-primary/20' : 'hover:bg-base-200'}`}
              onClick={() => setActiveSection('orders')}
            >
              <ShoppingBagIcon className="size-5" /> Orders
            </a>
          </li>
          <li>
            <a
              className={`flex items-center gap-3 text-base-content ${activeSection === 'products' ? 'active !text-primary !bg-primary/20' : 'hover:bg-base-200'}`}
              onClick={() => setActiveSection('products')}
            >
              <PackageIcon className="size-5" /> Products
            </a>
          </li>
          <li>
            <a
              className={`flex items-center gap-3 text-base-content ${activeSection === 'coupons' ? 'active !text-primary !bg-primary/20' : 'hover:bg-base-200'}`}
              onClick={() => setActiveSection('coupons')}
            >
              <GiftIcon className="size-5" /> Coupons
            </a>
          </li>
          <li>
            <a
              className={`flex items-center gap-3 text-base-content ${activeSection === 'users' ? 'active !text-primary !bg-primary/20' : 'hover:bg-base-200'}`}
              onClick={() => setActiveSection('users')}
            >
              <UsersIcon className="size-5" /> Users
            </a>
          </li>
        </ul>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </motion.div>
  );
}

export default AdminPage;
