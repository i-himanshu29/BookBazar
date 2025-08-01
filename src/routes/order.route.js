import { Router } from "express";
import {
   cancelOrderValidator,
   createOrderValidator,
   updateOrderStatusValidator,
} from "../validators/order.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { checkAdmin,verifyJWT } from "../middlewares/auth.middleware.js";
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

router
   .route("/create")
   .post(verifyJWT , createOrderValidator(), validate, createOrder);
router
   .route("/user")
   .get(verifyJWT , getUsersOrder);
router
   .route("/:orderId")
   .get(verifyJWT , getOrderById);
router
   .route("/")
   .get(verifyJWT , checkAdmin, getAllOrders);
router
   .route("/status/:orderId")
   .get(getOrderStatus);
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
