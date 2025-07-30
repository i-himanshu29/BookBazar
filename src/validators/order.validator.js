import { body, param } from "express-validator";

const createOrderValidator = () => {
   return [
      body("items")
         .isArray({ min: 1 })
         .withMessage("At least one item is required in the order"),
      body("items.*.bookId")
         .notEmpty()
         .withMessage("BookId is required")
         .isMongoId()
         .withMessage("Invalid book Id"),
      body("items.*.quantity")
         .isInt({ min: 1 })
         .withMessage("Quantity must be atleast 1"),
      body("shippingAddress")
         .notEmpty()
         .withMessage("Shipping Address is required")
         .isMongoId()
         .withMessage("Invalid address Id"),
   ];
};

const updateOrderStatusValidator = () => {
   return [
      param("OrderId")
         .notEmpty()
         .withMessage("Order Id is required")
         .isMongoId()
         .withMessage("Invalid order ID"),
      body("status")
         .notEmpty()
         .withMessage("Order status is required")
         .isInt(["pending", "paid", "shipped", "cancelled"])
         .withMessage("Invalid order status"),
   ];
};

const cancelOrderValidator = () => {
   return [
      param("orderId")
         .notEmpty()
         .withMessage("Order Id is required")
         .isMongoId()
         .withMessage("Invalid order Id"),
   ];
};

const getOrderByIdValidator = () => {
   return [
      param("orderId")
         .notEmpty()
         .withMessage("Order Id is required")
         .isMongoId()
         .withMessage("Invalid order Id"),
   ];
};

export {
   createOrderValidator,
   updateOrderStatusValidator,
   cancelOrderValidator,
   getOrderByIdValidator,
};
