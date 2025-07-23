import { body } from "express-validator";

const initiatePaymentValidator = () => {
   return [
      body("orderId")
         .notEmpty()
         .withMessage("Order ID is required")
         .isMongoId()
         .withMessage("Invalid Order ID"),

      body("amount")
         .notEmpty()
         .withMessage("Amount is required")
         .isFloat({ gt: 0 })
         .withMessage("Amount must be a positive number"),

      body("method")
         .notEmpty()
         .withMessage("Payment method is required")
         .isString()
         .withMessage("Method must be a string"),

      body("providerReferenceId")
         .notEmpty()
         .withMessage("Provider Reference ID is required")
         .isString()
         .withMessage("Provider Reference ID must be a string"),
   ];
};

const verifyPaymentValidator = () => {
   return [
      body("orderId")
         .notEmpty()
         .withMessage("Order ID is required")
         .isMongoId()
         .withMessage("Invalid Order ID"),

      body("paymentStatus")
         .notEmpty()
         .withMessage("Payment status is required")
         .isIn(["completed", "failed"])
         .withMessage("Invalid payment status"),

      body("providerReferenceId")
         .notEmpty()
         .withMessage("Provider Reference ID is required")
         .isString()
         .withMessage("Must be a valid reference ID"),
   ];
};

export { 
   initiatePaymentValidator, 
   verifyPaymentValidator 
};
