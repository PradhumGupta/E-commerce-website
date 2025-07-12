import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  HomeIcon,
  ReceiptTextIcon,
} from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCartStore";
// Framer Motion variants for page entrance

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

// Framer Motion variants for card/section entrance
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 120,
    },
  },
};

function PurchaseSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Get the session_id from the URL

  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const handleSuccessPage = async () => {
      setIsProcessing(true);
      try {
        const res = await axios.post("/payments/checkout-success", {
          sessionId,
        });
        if (res.data.success === true) {
          console.log(res);
          setOrderDetails(res.data.orderId);
          if (res.data.orderType === "product") clearCart();
          setIsProcessing(false);
        }
      } catch (error) {
        setIsProcessing(false);
        console.log("Error in loading payment success page", error);
        toast.error(error.response.data.error || error.response.data.message);
      }
    };
    if (sessionId) {
      handleSuccessPage();
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="text-center text-base-content/70 text-xl">
          Invalid access. No session ID found.
          <br />
          <Link
            to="/"
            className="link link-hover text-primary mt-4 inline-block"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-base-200 py-10 px-4"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/10 p-8 text-center"
        variants={cardVariants}
      >
        {!isProcessing ? (
          <div className="card-body p-0">
            <CheckCircleIcon className="size-20 text-success mx-auto mb-6" />
            <h2
              className="card-title text-3xl font-bold mb-4 text-center mx-auto
            bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Purchase Successful!
            </h2>
            <p className="text-base-content/80 text-lg mb-6">
              Thank you for your order.
            </p>

            <div className="text-left space-y-3 text-base-content/90 mb-8">
              <div className="flex items-center gap-3">
                <ReceiptTextIcon className="size-5 text-primary" />
                <span className="font-semibold">Order ID:</span>
                <span>{orderDetails}</span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <HomeIcon className="size-5" /> Continue Shopping
                </Link>
                <Link
                  to="/my-orders"
                  className="btn btn-outline btn-secondary btn-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ShoppingBagIcon className="size-5" /> View My Orders
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-base-content/70 mb-8">Loading order details...</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default PurchaseSuccessPage;
