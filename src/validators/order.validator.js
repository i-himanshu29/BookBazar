import { body, param } from "express-validator";

const createOrderValidator = () => {
   return [
      body("shippingAddress")
         .notEmpty()
         .withMessage("Shipping Address is required")
         .isMongoId()
         .withMessage("Invalid address Id"),

      body("paymentMethod")
         .notEmpty()
         .withMessage("Payment method is required")
         .isString()
         .withMessage("Invalid payment method"),
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
