import { asyncHandler } from "../utils/async-handler.util.js";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";

const addReview = asyncHandler(async (req, res) => {
   // 1️. Get userId from req.user and bookId, rating, comment from req.body
   const userId = req.user.id;
   const { rating, comment } = req.body;
   const {bookId} = req.params;

   // 2️. Validate input (ensure bookId and rating are present)
   if (!bookId || !rating) {
      throw new ApiError(400, "Book ID and rating are required");
   }

   // 3️. Check if the user already reviewed this book
   const existingReview = await Review.findOne({ user: userId, book: bookId });
   if (existingReview) {
      throw new ApiError(400, "You have already reviewed this book");
   }

   // 4️. Save the new review in the database
   const review = await Review.create({
      userId: userId,
      bookId: bookId,
      rating,
      comment,
   });

   // 5️. Return the created review in response
   return res
      .status(201)
      .json(new ApiResponse(201, review, "Review added successfully"));
});

const getBookReview = asyncHandler(async (req, res) => {
   // 1️. Get the bookId from req.params or req.query (NOT req.body for GET requests)
   const { bookId } = req.params;

   // 2️. Validate input
   if (!bookId) {
      throw new ApiError(400, "Book ID is required");
   }

   // 3️. Fetch all reviews for the book from DB
   const reviews = await Review.find({bookId })
      .populate("userId", "name") // Optional: populate user info
      .sort({ createdAt: -1 });
      console.log("reviews:", reviews);
   // 4️. Return response (even if empty)
   return res
      .status(200)
      .json(new ApiResponse(200, reviews, "Book reviews fetched successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
   // 1️. Get reviewId from req.params
   const { reviewId } = req.params;

   // 2️. Validate reviewId
   if (!reviewId) {
      throw new ApiError(400, "Review ID is required");
   }

   // 3️. Check if review exists
   const review = await Review.findById(reviewId);
   if (!review) {
      throw new ApiError(404, "Review not found");
   }

   // 4️. Delete the review
   await review.deleteOne();

   // 5️. Return response
   return res
      .status(200)
      .json(new ApiResponse(200, null, "Review deleted successfully"));
});

export { 
    addReview, 
    getBookReview, 
    deleteReview
};
