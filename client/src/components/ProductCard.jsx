import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSignIcon, ShoppingCartIcon, TagIcon } from "lucide-react"; // Icons for product details
import { useUserStore } from "../store/useUserStore";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCartStore";

function ProductCard({ product }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please LogIn to add products to cart");
      return;
    } else {
      console.log("Adding to cart", product._id);
      addToCart(product._id);
    }
  };

  return (
    <motion.div
      className="w-fit border border-base-content/10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }} // Subtle lift on hover
    >
      <Link to={`/product/${product.id}`}>
        <figure className="max-h-72 overflow-hidden bg-base-300 rounded-t-lg">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/200x200/CCCCCC/000000?text=Product";
              }} // Fallback image
            />
          ) : (
            <div className="w-full h-full text-base-content/50 text-xl font-bold"></div>
          )}
        </figure>
      </Link>

      <div className="p-6">
        <h2 className="text-xl font-bold text-primary mb-2">{product.name}</h2>
        <div className="flex sm:flex-row items-center justify-between text-base-content/90 font-semibold mt-auto">
          <span className="flex items-center gap-1 text-lg">
            <DollarSignIcon className="size-5 text-accent" />{" "}
            {product.price.toFixed(2)}
          </span>
          <div className="card-actions justify-end">
            {" "}
            {/* mt-auto pushes action to bottom */}
            <div
              className="btn btn-primary btn-sm transition-colors duration-200 hover:bg-primary-focus hover:text-primary-content"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="size-4" /> 
              <span className="hidden sm:inline">Add to Cart</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
