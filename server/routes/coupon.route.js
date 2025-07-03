import { Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getCoupon, claimFreeCoupon, getUserOwnedCoupon, updateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

// @access  User
router.get("/some-coupon",protectRoute, async (req, res) => {})  // not done
router.get("/owned", protectRoute, getUserOwnedCoupon);
router.post("/apply", protectRoute, applyCoupon);
router.post("/claim", protectRoute, claimFreeCoupon);



router.route("/")
    .post(protectRoute, adminRoute, createCoupon)
    .get(protectRoute, getAllCoupons)

router.route("/:id")
    .get(protectRoute, adminRoute, getCoupon) // not done
    .put(protectRoute, adminRoute, updateCoupon)
    .delete(protectRoute, adminRoute, deleteCoupon)


export default router;