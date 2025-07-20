import { asyncHandler } from "../utils/async-handler.util";

const createOrder = asyncHandler(async (req, res) => {});

const getUsersOrder = asyncHandler(async (req, res) => {});

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
