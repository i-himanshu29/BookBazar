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

const router = Router();

router.route("/:bookId").post(addReviewValidator(), validate, addReview);
router.route("/:bookId").get(getBookReview);
router
   .route("/:reviewId")
   .delete(deleteReviewValidator(), validate, deleteReview);
export default router;
