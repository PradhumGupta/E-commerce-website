import { Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getCoupon, getUserOwnedCoupon, updateCoupon } from "../controllers/coupon.controller.js";

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
router.get("/apply", protectRoute, applyCoupon);

export default router;