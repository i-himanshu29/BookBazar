import { Router } from "express";
import {
   getDailyOrders,
   getRevenueReports,
   getSiteStatus,
   getTopSellingBooks,
   getTopUsers,
} from "../controllers/adminDashboard.controller.js";
import { checkAdmin,verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/site-status").get(verifyJWT , checkAdmin, getSiteStatus);
router.route("/top-book").get(verifyJWT , checkAdmin, getTopSellingBooks);
router.route("/top-users").get(verifyJWT ,checkAdmin, getTopUsers);
router.route("/daily-orders").get(verifyJWT ,checkAdmin, getDailyOrders);
router.route("/revenue").get(verifyJWT ,checkAdmin, getRevenueReports);

export default router;
