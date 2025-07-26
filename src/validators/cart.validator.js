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

const updateCartItemValidator = () => {
   return [
      body("bookId")
         .notEmpty()
         .withMessage("Book ID is required")
         .isMongoId()
         .withMessage("Invalid Book ID"),

      body("quantity")
         .notEmpty()
         .withMessage("Quantity is required")
         .isInt({ min: 1 })
         .withMessage("Quantity must be a positive number"),
   ];
};

const removeFromCartValidator = () => {
   return [
      body("bookId")
         .notEmpty()
         .withMessage("Book ID is required")
         .isMongoId()
         .withMessage("Invalid Book ID"),
   ];
};

export { 
    addToCartValidator, 
    updateCartItemValidator, 
    removeFromCartValidator 
};
