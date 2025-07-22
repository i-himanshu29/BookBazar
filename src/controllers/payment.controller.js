import { asyncHandler } from "../utils/async-handler.util.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";

const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const initiatePayment = asyncHandler(async (req, res) => {
   // 1️. Extract user & cart/order/payment details from req.body or req.user
   // 2️. Validate the required data (amount, user, items, etc.)
   // 3️. Create an order/payment intent via the payment gateway (e.g., Razorpay/Stripe)
   // 4️. Save the payment details (temporary status) in DB if needed
   // 5️. Return the payment gateway's response to frontend

   const { amount, currency = "INR", receipt } = req.body;
   const userId = req.user._id;

   if (!amount || !receipt) {
      throw new ApiError(400, "Amount and receipt are required");
   }

   const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt,
   };

   const order = await razorpay.orders.create(options);

   // Optionally store in DB
   await Payment.create({
      user: userId,
      orderId: order.id,
      amount,
      currency,
      status: "created",
   });

   return res
      .status(201)
      .json(new ApiResponse(201, order, "Payment initiated successfully"));
});

const verifyPayment = asyncHandler(async (req, res) => {
   // 1️. Extract payment details from req.body
   // 2️. Validate if all fields are present (razorpay_order_id, payment_id, signature)
   // 3️. Generate the signature on server using secret
   // 4️. Compare it with the signature from Razorpay
   // 5️. If matched, mark payment/order as 'paid'
   // 6️. Return success response; else throw error

   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, "Missing required payment details");
   }

   // Step 1: Generate server-side signature
   const body = `${razorpay_order_id}|${razorpay_payment_id}`;
   const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

   // Step 2: Compare signatures
   const isValid = expectedSignature === razorpay_signature;

   if (!isValid) {
      throw new ApiError(400, "Invalid payment signature");
   }

   // Step 3: Update Payment Status in DB
   const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
         paymentId: razorpay_payment_id,
         status: "paid",
         signature: razorpay_signature,
      },
      { new: true },
   );

   if (!payment) {
      throw new ApiError(404, "Payment not found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, payment, "Payment verified successfully"));
});

const getUserPayments = asyncHandler(async (req, res) => {
   // 1️. Extract user ID from req.user (authenticated user)
   // 2️. Query the payment collection for records by userId
   // 3️. If no payments found, return an appropriate message
   // 4️. If found, return them in the response

   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(401, "Unauthorized access");
   }

   const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

   if (!payments || payments.length === 0) {
      throw new ApiError(404, "No payment records found for this user");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, payments, "User payments fetched successfully"),
      );
});

const getAllPayment = asyncHandler(async (req, res) => {
   // 1️. Verify that the requester is an admin (optional but recommended)
   // 2️. Fetch all payment records from the database
   // 3️. Sort them by date (optional)
   // 4️. Return payments in response

   // Optional: check admin role if needed
   // if (!req.user?.isAdmin) throw new ApiError(403, "Access denied");

   const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            payments,
            "All payment records fetched successfully",
         ),
      );
});

export { 
    initiatePayment, 
    verifyPayment, 
    getAllPayment, 
    getUserPayments
};
