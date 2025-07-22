import { asyncHandler } from "../utils/async-handler.util.js";
import crypto from "crypto";
import { ApiKey } from "../models/apiKey.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";

const generateKey = asyncHandler(async (req, res) => {
   // 1️. Get user ID from req.user
   // 2️. Generate a unique API key or token
   // 3️. Save the key in the DB (associated with the user or global key store)
   // 4️. Return the key in the response

   const userId = req.user.id;

   // Generate a random key (e.g. 32 chars hex string)
   const apiKey = crypto.randomBytes(32).toString("hex");

   // Save the key in DB (assuming an ApiKey model or saving inside User)
   const key = await ApiKey.create({
      user: userId,
      key: apiKey,
      createdAt: new Date(),
   });

   return res
      .status(201)
      .json(new ApiResponse(201, key, "API Key generated successfully"));
});

const revokeKey = asyncHandler(async (req, res) => {
   // 1️. Extract the API key (or ID) from req.params or req.body
   // 2️. Check if the key exists in the DB
   // 3️. If not found, return ApiError
   // 4️. If found, delete/revoke the key
   // 5️. Return success response

   const { keyId } = req.params; // Or req.body depending on your design

   const existingKey = await ApiKey.findById(keyId);

   if (!existingKey) {
      throw new ApiError(404, "API key not found");
   }

   await existingKey.deleteOne();

   return res
      .status(200)
      .json(new ApiResponse(200, null, "API key revoked successfully"));
});

const getUserKeys = asyncHandler(async (req, res) => {
   // 1️. Get user ID from req.user (assuming authentication middleware is in place)
   // 2️. Query the database for all keys associated with that user
   // 3️. If no keys found, return a response with empty array or message
   // 4️. Return the list of keys in response

   const userId = req.user._id; // assuming user is authenticated and attached to req

   const userKeys = await ApiKey.find({ user: userId });

   return res
      .status(200)
      .json(
         new ApiResponse(200, userKeys, "User API keys fetched successfully"),
      );
});

export { 
    generateKey, 
    getUserKeys, 
    revokeKey,
};
