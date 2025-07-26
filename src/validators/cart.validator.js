import { body,param } from "express-validator";

const addToCartValidator = () => {
   return [
      param("bookId")
         .notEmpty()
         .withMessage("Book ID is required")
         .isMongoId()
         .withMessage("Invalid Book ID"),

      body("quantity")
         .optional()
         .isInt({ min: 1 })
         .withMessage("Quantity must be at least 1"),
   ];
};

export { 
    addToCartValidator,
};
