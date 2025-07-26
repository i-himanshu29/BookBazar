import { Router } from "express";
import {
   addToCartValidator,
   removeFromCartValidator,
   updateCartItemValidator,
} from "../validators/cart.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
   addToCart,
   getCartItems,
   removeFromCart,
   updateCartItemQuantity,
} from "../controllers/cart.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/add/:bookId").post(verifyJWT , addToCartValidator(), validate, addToCart);
router.route("/").get(getCartItems);
router
   .route("/update/:bookId")
   .patch(updateCartItemValidator, validate, updateCartItemQuantity);
router
   .route("/remove/:bookId")
   .delete(removeFromCartValidator(), validate, removeFromCart);

export default router;
