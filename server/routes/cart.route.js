import { Router } from "express"
import { addToCart, getCartProducts, removeFromCart, updateCartItemQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeFromCart);
router.put("/", protectRoute, updateCartItemQuantity);

export default router;