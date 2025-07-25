import { Router } from "express";
import {
   cancelOrderValidator,
   createOrderValidator,
   updateOrderStatusValidator,
} from "../validators/order.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { checkAdmin } from "../middlewares/auth.middleware.js";
import {
   cancelOrder,
   createOrder,
   getAllOrders,
   getOrderById,
   getOrderStatus,
   getUsersOrder,
   updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(createOrderValidator(), validate, createOrder);
router.route("/user").get(getUsersOrder);
router.route("/:orderId").get(validate, getOrderById);
router.route("/").get(checkAdmin, getAllOrders);
router.route("/status/:orderId").get(getOrderStatus);
router
   .route("/status/:orderId")
   .patch(
      updateOrderStatusValidator(),
      validate,
      checkAdmin,
      updateOrderStatus,
   );
router
   .route("/cancel/:orderId")
   .patch(cancelOrderValidator(), validate, cancelOrder);

export default router;
