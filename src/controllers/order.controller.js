import { asyncHandler } from "../utils/async-handler.util.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";

const createOrder = asyncHandler(async (req, res) => {
   // 1️. Extract data from req.body (e.g. items, shippingAddress, payment info)
   const { items, shippingAddress, paymentMethod } = req.body;

   // 2. Validate required fields
   if (!items || items.length === 0 || !shippingAddress || !paymentMethod) {
      throw new ApiError(400, "Missing order details");
   }

   // 3️. Get the user ID from the request (assumes auth middleware ran)
   const userId = req.user.id;

   // 4️. Optionally verify items exist in the user's cart (optional if frontend sends item info directly)
   const cartItems = await Cart.find({ user: userId });
   if (!cartItems || cartItems.length === 0) {
      throw new ApiError(400, "No items in cart to place an order");
   }

   // 5️. Calculate total price
   const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
   );

   // 6️. Create order document
   const order = await Order.create({
      user: userId,
      items: cartItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: "PLACED", // default status
   });

   // 7️. Clear the user's cart (optional but common)
   await Cart.deleteMany({ user: userId });

   // 8️. Return success response
   return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getUsersOrder = asyncHandler(async (req, res) => {
   // 1️⃣ Get user ID from authenticated request
   const userId = req.user.id;

   // 2️⃣ Fetch all orders placed by this user
   const orders = await Order.find({ user: userId });

   // 3️⃣ Check if any orders exist
   if (!orders || orders.length === 0) {
      throw new ApiError(404, "No orders found for this user");
   }

   // 4️⃣ Return all orders
   return res
      .status(200)
      .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {});

const getAllOrders = asyncHandler(async (req, res) => {});

const updateOrderStatus = asyncHandler(async (req, res) => {});

const cancelOrder = asyncHandler(async (req, res) => {});

export {
   createOrder,
   getOrderById,
   getUsersOrder,
   getAllOrders,
   updateOrderStatus,
   cancelOrder,
};
