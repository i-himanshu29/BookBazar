import { Router } from "express";
import {
   changeCurrrentPassword,
   forgotPasswordRequest,
   getProfile,
   loginUser,
   logoutUser,
   refreshAccessToken,
   registerUser,
   resendVerifcationEmail,
   verifyUser,
} from "../controllers/auth.controller.js";
import {
   forgotPasswordValidator,
   loginValidator,
   userChangeCurrentPasswordValidator,
   userRegistrationValidator,
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
   .route("/register")
   .post(userRegistrationValidator(), validate, registerUser);
router.route("/login").get(loginValidator(), validate, loginUser);
router.route("/verify/:token").get(verifyUser);
router.route("/resend-mail").get(verifyJWT, resendVerifcationEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
   .route("/forgot-password")
   .get(verifyJWT, forgotPasswordValidator(), validate, forgotPasswordRequest);

router
   .route("/change-password")
   .get(verifyJWT, userChangeCurrentPasswordValidator, changeCurrrentPassword);

router.route("/getMe").get(verifyJWT, getProfile);
router.route("/logout").get(verifyJWT, logoutUser);

export default router;
