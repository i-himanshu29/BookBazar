import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { userRegistrationValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate, registerUser);


export default router;