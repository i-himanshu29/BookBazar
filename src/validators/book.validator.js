import { body } from "express-validator";

const addBookValidator = () => {
   return [
      body("title")
         .trim()
         .notEmpty()
         .withMessage("Title is required")
         .isLength({ min: 2 })
         .withMessage("Title should be at least 2 characters long")
         .isLength({ max: 50 })
         .withMessage("Title cannot exceed 50 characters"),

      body("description")
         .trim()
         .notEmpty()
         .withMessage("Description is required")
         .isLength({ min: 8 })
         .withMessage("Description should be at least 8 characters long")
         .isLength({ max: 500 })
         .withMessage("Description cannot exceed 500 characters"),

      body("author")
         .trim()
         .notEmpty()
         .withMessage("Author name is required")
         .isLength({ min: 2 })
         .withMessage("Author name should be at least 2 characters")
         .isLength({ max: 50 })
         .withMessage("Author name cannot exceed 50 characters"),

      body("price")
         .notEmpty()
         .withMessage("Price is required")
         .custom((value) => {
            const num = parseFloat(value);
            if (isNaN(num)) throw new Error("Price must be a valid number");
            return true;
         }),
      body("stock")
         .notEmpty()
         .withMessage("Stock is required")
         .custom((value) => {
            const num = parseInt(value, 10);
            if (isNaN(num) || num < 0) throw new Error("Stock must be a non-negative integer");
            return true;
         }),
   ];
};

const updateBookValidator = () => {
   return [
      body("title")
         .trim()
         .notEmpty()
         .withMessage("Title is required")
         .isLength({ min: 2 })
         .withMessage("Title should be at least 2 characters long")
         .isLength({ max: 50 })
         .withMessage("Title cannot exceed 50 characters"),
      body("description")
         .trim()
         .notEmpty()
         .withMessage("Description is required")
         .isLength({ min: 8 })
         .withMessage("Description should be at least 8 characters long")
         .isLength({ max: 500 })
         .withMessage("Description cannot exceed 500 characters"),
      body("imageUrl")
         .trim()
         .notEmpty()
         .withMessage("Image URL is required")
         .isURL()
         .withMessage("Image URL must be a valid URL"),
   ];
};

export { addBookValidator ,updateBookValidator};
