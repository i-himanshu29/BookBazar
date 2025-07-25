import { Router } from "express";
import {
   addReviewValidator,
   deleteReviewValidator,
} from "../validators/review.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
   addReview,
   deleteReview,
   getBookReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
   .route("/add-review/:bookId")
   .post(verifyJWT, addReviewValidator(), validate, addReview);
router.route("/:bookId").get(verifyJWT , getBookReview);
router
   .route("/:reviewId")
   .delete(verifyJWT , deleteReviewValidator(), validate, deleteReview);
export default router;
