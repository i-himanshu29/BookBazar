import { Router } from "express";
import { checkAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
   initiatePaymentValidator,
   verifyPaymentValidator,
} from "../validators/payment.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
   getAllPayment,
   getUserPayments,
   initiatePayment,
   verifyPayment,
} from "../controllers/payment.controller.js";

const router = Router();

router
   .route("/initiate")
   .post(verifyJWT , initiatePayment);// initiatePaymentValidator(), validate,
router
   .route("/verify")
   .post(verifyPaymentValidator(), validate, verifyJWT, verifyPayment);
router
   .route("/user")
   .get(getUserPayments);
router
   .route("/get-all-payment")
   .get(checkAdmin, getAllPayment);

export default router;
