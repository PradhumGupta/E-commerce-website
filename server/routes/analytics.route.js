import { Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData
        })

    } catch (error) {
        console.log("Error in analytics route:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;