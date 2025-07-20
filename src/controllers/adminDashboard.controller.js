import { asyncHandler } from "../utils/async-handler.util";

const getSiteStatus = asyncHandler(async (req, res) => {});

const getTopSellingBooks = asyncHandler(async (req, res) => {});

const getTopUsers = asyncHandler(async (req, res) => {});

const getDailyOrders = asyncHandler(async (req, res) => {});

const getRevenueReports = asyncHandler(async (req, res) => {});

const getAllUsers = asyncHandler(async (req, res) => {});

export {
   getSiteStatus,
   getTopSellingBooks,
   getTopUsers,
   getDailyOrders,
   getRevenueReports,
   getAllUsers,
};
