import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CouponCard from "../components/CouponCard";
import { useCouponStore } from "../store/useCouponStore";
import LoadingSpinner from "../components/LoadingSpinner";

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
