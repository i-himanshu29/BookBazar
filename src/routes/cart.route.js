import { Router } from "express";
import { addToCartValidator } from "../validators/cart.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
   addToCart,
   getCartItems,
   removeFromCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router
   .route("/add/:bookId")
   .post(verifyJWT, addToCartValidator(), validate, addToCart);

router
   .route("/")
   .get(verifyJWT, getCartItems);

router
   .route("/remove/:cartItemId")
   .delete(verifyJWT, removeFromCart);

export default router;
