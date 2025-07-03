import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PercentIcon,
  DollarSignIcon,
  ClipboardCheckIcon, // For copied state
  ClipboardIcon,      // For copy button
  GiftIcon,           // Generic coupon icon
  CheckCircle2,       // For claimed status
  ShoppingCartIcon,   // For buyable coupon
} from 'lucide-react';
import { useCouponStore } from '../store/useCouponStore';

function CouponCard({ coupon }) {
  const [isCopied, setIsCopied] = useState(false);

  const { claimCoupon } = useCouponStore();

  const handleCopyCode = async () => {
    // In a real application, coupon codes would be generated or retrieved
    // from the backend. For dummy data, we'll use a placeholder code.
    const codeToCopy = coupon.code; // Replace with actual coupon.code from backend (if available to user)
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
      console.log(`Copied coupon code: ${codeToCopy}`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or if navigator.clipboard is not available
      const textArea = document.createElement("textarea");
      textArea.value = codeToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        console.log(`Copied coupon code (fallback): ${codeToCopy}`);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleAcquireCoupon = async (id) => {
    await claimCoupon(id)
    if (coupon.price === 0) {
      console.log(`Coupon "${coupon.title}" claimed for free!`);
    } else {
      console.log(`Coupon "${coupon.title}" bought for $${coupon.price.toFixed(2)}!`);
      // You'd typically redirect to a checkout or payment gateway here
    }
    // After a successful API call, you might show a success message
    // or refresh the user's list of acquired coupons.
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 100 } }
  };

  return (
    <motion.div
      className="card max-w-xs bg-base-100 shadow-xl border border-base-content/10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }} // Subtle lift on hover
    >
      {/* Coupon Image */}
      <figure className="h-40 overflow-hidden bg-base-300 rounded-t-lg">
        {coupon.image ? (
          <img
            src={coupon.image}
            alt={coupon.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/160x90/CCCCCC/000000?text=Coupon"; }} // Fallback image
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/50 text-xl font-bold">
            <GiftIcon className="size-12 text-primary/50" />
          </div>
        )}
      </figure>

      <div className="card-body p-6">
        <h2 className="card-title text-2xl font-bold text-primary flex items-center justify-between">
          <span>{coupon.title}</span>
          {/* Display price badge only if coupon is NOT free (price > 0) */}
          {coupon.price > 0 && (
            <span className="badge badge-lg badge-secondary">${coupon.price.toFixed(2)}</span>
          )}
        </h2>
        <p className="text-base-content/80 mb-2">{coupon.description}</p>

        <div className="flex items-center gap-2 text-base-content/70 text-lg font-semibold mb-4">
          {coupon.discountType === 'percent' ? (
            <>
              <PercentIcon className="size-5 text-accent" /> {coupon.discountValue}% OFF
              {coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0 && (
                <span className="text-sm font-normal text-base-content/50 ml-1">(Max ${coupon.maxDiscountAmount.toFixed(2)})</span>
              )}
            </>
          ) : (
            <>
              <DollarSignIcon className="size-5 text-accent" /> ${coupon.discountValue.toFixed(2)} OFF
            </>
          )}
        </div>

        <div className="card-actions justify-end mt-auto"> {/* mt-auto pushes actions to bottom */}
          
          {!coupon.code ? (
            <button
              className="btn btn-outline btn-primary btn-sm flex items-center gap-2 transition-colors duration-200 hover:bg-primary hover:text-primary-content"
              onClick={() => handleAcquireCoupon(coupon._id)}
            >
              {coupon.price > 0 ? (
                <>
                  <ShoppingCartIcon className="size-4" /> Buy Coupon
                </>
              ) : (
                <>
                  <GiftIcon className="size-4" /> Claim Coupon
                </>
              )}
            </button>
          ) : (
            <>
              <button className="btn btn-success btn-sm flex items-center gap-2" disabled>
                <CheckCircle2 className="size-4" /> Claimed!
              </button>
              {/* Show Copy Code button ONLY if coupon is acquired */}
              <button
                className="btn btn-secondary btn-sm flex items-center gap-2 transition-colors duration-200 hover:bg-secondary-focus hover:text-secondary-content"
                onClick={handleCopyCode}
              >
                {isCopied ? <ClipboardCheckIcon className="size-4" /> : <ClipboardIcon className="size-4" />}
                {isCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CouponCard;
