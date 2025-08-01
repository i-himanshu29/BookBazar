import { asyncHandler } from "../utils/async-handler.util.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { Cart } from "../models/cartItem.model.js";

const createOrder = asyncHandler(async (req, res) => {
   // 1️. Extract data from req.body (e.g. items, shippingAddress, payment info)
   const {shippingAddress, paymentMethod } = req.body;

   // 2. Validate required fields
   if ( !shippingAddress || !paymentMethod) {
      throw new ApiError(400, "Missing order details");
   }

   // 3️. Get the user ID from the request (assumes auth middleware ran)
   const userId = req.user.id;
   console.log("userId:", userId);
   // 4️. Optionally verify items exist in the user's cart (optional if frontend sends item info directly)
   const cartItems = await Cart.find({ userId }).populate("bookId");
   console.log("cartItems:", cartItems);
   if (!cartItems || cartItems.length === 0) {
      throw new ApiError(400, "No items in cart to place an order");
   }

   let totalPrice = 0;
   const orderItems = cartItems.map((item) => {
      if (!item.bookId || !item.bookId.title || !item.bookId.price) {
         throw new ApiError(400, "Invalid book data in cart item");
      }

      const price = item.bookId.price;
      const title = item.bookId.title;
      const quantity = item.quantity;

      totalPrice += price * quantity;

      return {
         bookId: item.bookId._id,
         title,
         quantity,
         price,
      };
   });

   console.log("totalPrice:", totalPrice);

   // 6️. Create order document
   const order = await Order.create({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      // status: "PLACED", // default status
   });

   console.log("order:", order);
   // 7️. Clear the user's cart (optional but common)
   await Cart.deleteMany({ userId: userId });

   // 8️. Return success response
   return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getUsersOrder = asyncHandler(async (req, res) => {
   // 1️. Get user ID from authenticated request
   const userId = req.user.id;

   // 2️. Fetch all orders placed by this user
   const orders = await Order.find({ user: userId });

   // 3️. Check if any orders exist
   if (!orders || orders.length === 0) {
      throw new ApiError(404, "No orders found for this user");
   }

   // 4️. Return all orders
   return res
      .status(200)
      .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
   // 1️. Get the order ID from req.params
   // 2️. Fetch the order from the database using the ID
   // 3️. If not found, throw an ApiError (404 Not Found)
   // 4️. If found, return success response with order data

   const { id } = req.params;

   const order = await Order.findById(id)
      .populate("userId", "username email")
      .populate("items.book");

   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
   // 1️. Fetch all orders from the database (optionally with filters or pagination)
   // 2️. If no orders found, throw an ApiError (404 Not Found)
   // 3️. If found, return a success response with order data

   const orders = await Order.find()
      .populate("userId", "username email")
      .populate("items.book");

   if (!orders || orders.length === 0) {
      throw new ApiError(404, "No orders found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const getOrderStatus = asyncHandler(async (req, res) => {
   // 1️. Get the order ID from req.params or req.query
   // 2️. Find the order by ID in the database
   // 3️. If not found, return ApiError (404)
   // 4️. If found, return the current status of the order

   const { orderId } = req.params;

   const order = await Order.findById(orderId).select("status");
   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { status: order.status },
            "Order status fetched successfully",
         ),
      );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
   // 1️. Get order ID from req.params
   // 2️. Get new status from req.body
   // 3️. Validate new status (optional: ensure it's one of allowed statuses)
   // 4️. Find order in DB using ID
   // 5️. If order not found, throw ApiError
   // 6️. Update the order status and save
   // 7️. Return success response with updated order

   const { orderId } = req.params;
   const { status } = req.body;

   const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
   ];

   // Validate status
   if (!status || !allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid or missing order status");
   }

   const order = await Order.findById(orderId);
   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   order.status = status;
   await order.save();

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
   // 1️. Get order ID from req.params or req.body
   // 2️. Find the order in the DB
   // 3️. If not found, return ApiError (404)
   // 4️. If order is already delivered/shipped, cancel not allowed (optional)
   // 5️. Update order status to "cancelled"
   // 6️. Optionally restore book stock
   // 7️. Save order and return response

   const { orderId } = req.params;

   const order = await Order.findById(orderId);
   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   // Optional check: prevent cancel if already shipped/delivered
   if (["shipped", "delivered"].includes(order.status)) {
      throw new ApiError(
         400,
         "Cannot cancel an already shipped or delivered order",
      );
   }

   order.status = "cancelled";
   await order.save();

   // Optional: Restore book stock
   for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
         $inc: { stock: item.quantity },
      });
   }

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

export {
   createOrder,
   getOrderById,
   getUsersOrder,
   getAllOrders,
   getOrderStatus,
   updateOrderStatus,
   cancelOrder,
};
