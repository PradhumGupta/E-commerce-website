import { Router } from "express";
import { createProduct, deleteProduct, getFeaturedProducts, getProduct, getProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct, updateProduct } from "../controllers/products.controllers.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, adminRoute, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/:id", getProduct);
router.post("/add", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.put("/:id", updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;