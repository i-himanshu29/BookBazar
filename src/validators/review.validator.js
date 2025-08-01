import { body, param } from "express-validator";

const addReviewValidator = () => {
   return [
      param("bookId")
         .notEmpty()
         .withMessage("Book ID is required")
         .isMongoId()
         .withMessage("Invalid Book ID"),
      body("rating")
         .notEmpty()
         .withMessage("Rating is required")
         .isInt({ min: 1, max: 5 })
         .withMessage("Rating must be between 1 and 5"),
      body("comment")
         .trim()
         .notEmpty()
         .withMessage("Comment is required")
         .isLength({ min: 5 })
         .withMessage("Comment should be at least 5 character"),
   ];
};

const deleteReviewValidator = () => {
   return [
      param("reviewId")
         .notEmpty()
         .withMessage("Review Id is required")
         .isMongoId()
         .withMessage("Invalid Review Id"),
   ];
};

export { 
    addReviewValidator, 
    deleteReviewValidator, 
};
