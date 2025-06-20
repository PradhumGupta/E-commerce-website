import { Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getCoupon, getFreeCoupon, getUserOwnedCoupon, updateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

// @access  Admin
router.route("/")
    .post(protectRoute, adminRoute, createCoupon)
    .get(protectRoute, adminRoute, getAllCoupons)

router.route("/:id")
    .get(protectRoute, adminRoute, getCoupon) // not done
    .put(protectRoute, adminRoute, updateCoupon)
    .delete(protectRoute, adminRoute, deleteCoupon)


// @access  User
router.get("/:id",protectRoute, getCoupon)  // not done
router.get("/owned", protectRoute, getUserOwnedCoupon);
router.post("/apply", protectRoute, applyCoupon);
router.post("/buy-free-coupon", protectRoute, getFreeCoupon);

export default router;