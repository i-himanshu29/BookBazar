import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { Book } from "../models/book.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const getSiteStatus = asyncHandler(async (req, res) => {
   // 1️. Ensure the requester is an admin (middleware should handle this)
   // 2️. Fetch total users, total books, total orders, total revenue, etc.
   // 3️. Return the site status summary as JSON

   const totalUsers = await User.countDocuments();
   const totalBooks = await Book.countDocuments();
   const totalOrders = await Order.countDocuments();
   const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
   ]);

   const revenueAmount = totalRevenue[0]?.revenue || 0;

   return res.status(200).json(
      new ApiResponse(
         200,
         {
            totalUsers,
            totalBooks,
            totalOrders,
            totalRevenue: revenueAmount,
         },
         "Site status fetched successfully",
      ),
   );
});

const getTopSellingBooks = asyncHandler(async (req, res) => {
   // 1️. Aggregate order data to calculate total quantity sold per book
   // 2️. Sort books by quantity sold in descending order
   // 3️. Optionally limit the result (e.g. top 10)
   // 4️. Populate book details from Book model
   // 5️. Return response with top selling books

   const topBooks = await Order.aggregate([
      { $unwind: "$items" },
      {
         $group: {
            _id: "$items.book",
            totalSold: { $sum: "$items.quantity" },
         },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
         $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
         },
      },
      { $unwind: "$bookDetails" },
      {
         $project: {
            _id: 0,
            bookId: "$bookDetails._id",
            title: "$bookDetails.title",
            author: "$bookDetails.author",
            totalSold: 1,
            price: "$bookDetails.price",
            imageUrl: "$bookDetails.imageUrl",
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            topBooks,
            "Top selling books fetched successfully",
         ),
      );
});

const getTopUsers = asyncHandler(async (req, res) => {
   // 1️. Aggregate order data to calculate total spent per user
   // 2️. Sort users by total amount spent (or total orders)
   // 3️. Limit to top N users (e.g., top 10)
   // 4️. Populate user details (e.g., name, email)
   // 5️. Return response with top users

   const topUsers = await Order.aggregate([
      {
         $group: {
            _id: "$user",
            totalSpent: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
         },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
         $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
         },
      },
      { $unwind: "$userDetails" },
      {
         $project: {
            userId: "$userDetails._id",
            name: "$userDetails.username",
            email: "$userDetails.email",
            totalSpent: 1,
            totalOrders: 1,
         },
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, topUsers, "Top users fetched successfully"));
});

const getDailyOrders = asyncHandler(async (req, res) => {
   // 1️. Aggregate orders by day (using createdAt field)
   // 2️. Count total orders per day
   // 3️. Sort by date (optional: descending)
   // 4️. Return response

   const dailyOrders = await Order.aggregate([
      {
         $group: {
            _id: {
               year: { $year: "$createdAt" },
               month: { $month: "$createdAt" },
               day: { $dayOfMonth: "$createdAt" },
            },
            totalOrders: { $sum: 1 },
         },
      },
      {
         $sort: {
            "_id.year": -1,
            "_id.month": -1,
            "_id.day": -1,
         },
      },
      {
         $project: {
            date: {
               $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
               },
            },
            totalOrders: 1,
            _id: 0,
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(200, dailyOrders, "Daily orders fetched successfully"),
      );
});

const getRevenueReports = asyncHandler(async (req, res) => {
   // 1️. Use MongoDB aggregation to group orders by day/month/year
   // 2️. Calculate total revenue (sum of order totals)
   // 3️. Optionally sort by date
   // 4️. Return the formatted result

   const revenueReport = await Order.aggregate([
      {
         $group: {
            _id: {
               year: { $year: "$createdAt" },
               month: { $month: "$createdAt" },
               day: { $dayOfMonth: "$createdAt" },
            },
            totalRevenue: { $sum: "$totalPrice" }, // assuming `totalPrice` field exists
            totalOrders: { $sum: 1 },
         },
      },
      {
         $sort: {
            "_id.year": -1,
            "_id.month": -1,
            "_id.day": -1,
         },
      },
      {
         $project: {
            date: {
               $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
               },
            },
            totalRevenue: 1,
            totalOrders: 1,
            _id: 0,
         },
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            revenueReport,
            "Revenue report fetched successfully",
         ),
      );
});

const getAllUsers = asyncHandler(async (req, res) => {
   // 1️. Fetch all users from the database (optionally exclude sensitive fields)
   // 2️. Check if any users exist
   // 3️. Return users in response with success message

   const users = await User.find().select("-password -refreshToken"); // exclude sensitive fields

   if (!users || users.length === 0) {
      throw new ApiError(404, "No users found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully"));
});

export {
   getSiteStatus,
   getTopSellingBooks,
   getTopUsers,
   getDailyOrders,
   getRevenueReports,
   getAllUsers,
};
