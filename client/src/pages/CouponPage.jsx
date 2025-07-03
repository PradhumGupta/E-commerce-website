import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CouponCard from "../components/CouponCard";
import { useCouponStore } from "../store/useCouponStore";
import LoadingSpinner from "../components/LoadingSpinner"

// Dummy Data for User-Facing Coupons
// Adapted from admin dummy data, focusing on publicly available info
const publicCoupons = [
  {
    id: "CUP001",
    title: "Summer Sale 20% OFF",
    description: "Get 20% off on all seasonal items. Limited time offer!",
    discountType: "percent",
    discountValue: 20,
    maxDiscountAmount: 50.0, // Optional max cap for percent
    isFree: true, // Indicates if coupon is free to "claim" or costs something
    price: 0.0,
    category: "Seasonal",
    minOrderAmount: 50.0,
    image: "https://placehold.co/160x90/FFDDC1/FF5733?text=SummerSale",
  },
  {
    id: "CUP002",
    title: "Flat $10 Discount",
    description: "Save $10 on electronics orders over $100.",
    discountType: "flat",
    discountValue: 10,
    isFree: true,
    price: 0.0,
    category: "Electronics",
    minOrderAmount: 100.0,
    image: "https://placehold.co/160x90/D4EECC/228B22?text=GadgetDeal",
  },
  {
    id: "CUP003",
    title: "Exclusive Member Offer",
    description: "15% off for premium members. A small fee applies.",
    discountType: "percent",
    discountValue: 15,
    isFree: false,
    price: 5.0, // This coupon costs money to claim
    category: "Apparel",
    minOrderAmount: 75.0,
    image: "https://placehold.co/160x90/B0E0E6/4682B4?text=MemberShip",
  },
  {
    id: "CUP004",
    title: "Free Shipping Code",
    description: "Enjoy free standard shipping on your next purchase.",
    discountType: "flat", // Can still use flat type for 0 value for consistent display
    discountValue: 0,
    isFree: true,
    price: 0.0,
    category: "All Products",
    minOrderAmount: 25.0,
    image: "https://placehold.co/160x90/FFFACD/FFD700?text=FreeShipping",
  },
  {
    id: "CUP005",
    title: "New User Welcome 10%",
    description: "A special welcome gift for our new users!",
    discountType: "percent",
    discountValue: 10,
    isFree: true,
    price: 0.0,
    category: "All Products",
    minOrderAmount: 0,
    image: "https://placehold.co/160x90/E0BBE4/957DAD?text=Welcome",
  },
  {
    id: "CUP006",
    title: "Premium Savings Bundle",
    description: "Unlock massive savings with this exclusive bundle.",
    discountType: "percent",
    discountValue: 30,
    maxDiscountAmount: 100.0,
    isFree: false,
    price: 15.0,
    category: "All Products",
    minOrderAmount: 200.0,
    image: "https://placehold.co/160x90/C7F0DB/3CB371?text=PremiumBundle",
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
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

// Variants for section titles
const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

function CouponPage() {
  const { myCoupons, loading, allCoupons, getAllCoupons, getMyCoupons } = useCouponStore();
  const purchasedCoupons = myCoupons.map((coupon) => coupon._id);
  const freeCoupons = allCoupons.filter((coupon) => coupon.isFree && !purchasedCoupons.includes(coupon._id));
  const buyableCoupons = allCoupons.filter((coupon) => !coupon.isFree && !purchasedCoupons.includes(coupon._id));

  useEffect(() => {
    getAllCoupons();
    getMyCoupons();
  }, [getAllCoupons, getMyCoupons])

  return (
    <motion.div
      className="min-h-screen bg-base-200 py-10 px-4"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-12
          bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        >
          Discover Amazing Coupons
        </h1>

        { loading && allCoupons.length > 0 && <LoadingSpinner />}

        {/* My Coupons Section */}
        {myCoupons.length > 0 && (
          <>
            <motion.h2
              className="text-3xl font-bold text-base-content mb-6 mt-10"
              variants={titleVariants}
            >
              Your Coupons
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {myCoupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </div>
          </>
        )}

        {/* Free Coupons Section */}
        {freeCoupons.length > 0 && (
          <>
            <motion.h2
              className="text-3xl font-bold text-base-content mb-6 mt-10"
              variants={titleVariants}
            >
              Free Coupons
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCoupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </div>
          </>
        )}

        {/* Buyable Coupons Section */}
        {buyableCoupons.length > 0 && (
          <>
            <motion.h2
              className="text-3xl font-bold text-base-content mb-6 mt-10"
              variants={titleVariants}
            >
              Buyable Coupons
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {buyableCoupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </div>
          </>
        )}

        {allCoupons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-base-content/70 mt-16 text-xl"
          >
            No coupons available at all. Please check back later!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default CouponPage;
