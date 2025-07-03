import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCartIcon, // Main cart icon
  Trash2Icon, // Remove item icon
  PlusIcon, // Quantity increase
  MinusIcon, // Quantity decrease
  TagIcon, // Coupon icon
  DollarSignIcon, // Price icon
  PackageIcon, // Shipping icon
  ReceiptTextIcon, // Total/Summary icon
  XIcon,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";

// Framer Motion variants
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

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const summaryVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100, delay: 0.2 },
  },
};

function CartPage() {
  const { cart, removeItem, updateItem, applyCouponCode } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Helper to calculate dummy order summary
  const calculateOrderSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shipping = subtotal > 100 ? 0 : 7.99; // Free shipping over $100
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const orderSummary = calculateOrderSummary(cart);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    try {
      const discount = await applyCouponCode(couponCode, orderSummary.total);
      if (!discount) return;

      setCouponApplied(true);

      orderSummary.discount = discount;
      orderSummary.total -= discount;
    } catch (error) {
      console.log("error occurred", error);
    }
  };

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
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-base-content/70 mt-16 text-xl"
          >
            Your cart is empty. Start shopping!
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  className="card bg-base-100 shadow-lg border border-base-content/10 p-4 flex flex-row items-center gap-4"
                  variants={itemVariants}
                >
                  <figure className="w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/80x80/CCCCCC/000000?text=Item";
                      }}
                    />
                  </figure>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-base-content">
                        {item.name}
                      </h3>
                      <p className="text-base-content/70 text-sm">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="join border border-base-content/20 rounded-md">
                        <button
                          className="btn btn-ghost btn-xs join-item"
                          onClick={() =>
                            updateItem(item._id, item.quantity - 1, item.price)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="size-4" />
                        </button>
                        <span className="join-item btn btn-ghost btn-xs pointer-events-none">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-ghost btn-xs join-item"
                          onClick={() =>
                            updateItem(item._id, item.quantity + 1, item.price)
                          }
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-accent">
                        ${item.total.toFixed(2)}
                      </span>
                      <button
                        className="btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10"
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2Icon className="size-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Order Summary & Apply Coupon */}
            <motion.div
              className="max-w-full col-span-1 flex flex-col gap-6"
              variants={summaryVariants}
            >
              {/* Order Summary Card */}
              <div className="card bg-base-100 shadow-lg border border-base-content/10 p-6 rounded-box flex-shrink-0">
                <h2 className="card-title text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
                  <ReceiptTextIcon className="size-6 text-primary" /> Order Summary
                </h2>
                <ul className="space-y-3 text-base-content/80 text-md">
                  <li className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ${orderSummary.subtotal.toFixed(2)}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      {orderSummary.shipping === 0
                        ? "Free"
                        : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">
                      ${orderSummary.tax.toFixed(2)}
                    </span>
                  </li>
                  {couponApplied && (
                    <li className="flex justify-between items-center text-success">
                      <span>Coupon Discount:</span>
                      <span className="font-semibold">
                        -{orderSummary.discount}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between items-center border-t border-base-content/20 pt-3 text-xl font-bold text-base-content">
                    <span>Total:</span>
                    <span className="text-accent">
                      ${orderSummary.total.toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Apply Coupon Card */}
              <div className="card bg-base-100 shadow-lg border border-base-content/10 p-6 rounded-box flex-shrink-0">
                <h2 className="card-title text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
                  <TagIcon className="size-6 text-primary" /> Apply Coupon
                </h2>
                <form
                  onSubmit={handleApplyCoupon}
                  className="flex flex-col gap-4"
                >
                  <div className="form-control">
                    <label className="label m-1.5">
                      <span className="label-text text-base-content/80 font-semibold">
                        Coupon Code
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary w-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Apply
                  </button>
                  {couponApplied && (
                    <p className="text-success text-sm flex items-center gap-1">
                      <CheckCircle2 className="size-4" /> Coupon applied
                      successfully!
                    </p>
                  )}
                  {!couponApplied && couponCode && (
                    <p className="text-error text-sm flex items-center gap-1">
                      <XIcon className="size-4" /> Invalid coupon code.
                    </p>
                  )}
                </form>
              </div>

              {/* Checkout Button */}
              <button className="btn btn-primary btn-lg w-full mt-4 shadow-xl hover:shadow-2xl transition-all duration-200">
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CartPage;
