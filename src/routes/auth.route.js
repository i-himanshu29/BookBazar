import { Router } from "express";
import {
   changeCurrrentPassword,
   forgotPasswordRequest,
   getProfile,
   loginUser,
   logoutUser,
   refreshAccessToken,
   registerUser,
   resendVerificationEmail,
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
router.route("/login").post(loginValidator(), validate, loginUser);
router.route("/verify/:token").get(verifyUser);
router.route("/resend-mail").get(verifyJWT, resendVerificationEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
   .route("/forgot-password")
   .post(verifyJWT, forgotPasswordValidator(), validate, forgotPasswordRequest);

router
   .route("/change-password")
   .post(
      verifyJWT,
      userChangeCurrentPasswordValidator(),
      changeCurrrentPassword,
   );

router.route("/profile").get(verifyJWT, getProfile);
router.route("/logout").get(verifyJWT, logoutUser);

export default router;
