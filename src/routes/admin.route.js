import { Router } from "express";
import {
   getDailyOrders,
   getRevenueReports,
   getSiteStatus,
   getTopSellingBooks,
   getTopUsers,
} from "../controllers/adminDashboard.controller.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/site-status").get(checkAdmin, getSiteStatus);
router.route("/top-book").get(checkAdmin, getTopSellingBooks);
router.route("/top-users").get(checkAdmin, getTopUsers);
router.route("/daily-orders").get(checkAdmin, getDailyOrders);
router.route("/revenue").get(checkAdmin, getRevenueReports);

export default router;
