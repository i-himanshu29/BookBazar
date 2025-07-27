import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";

const addAddress = asyncHandler(async (req, res) => {
   // 1️. Extract data from body
   const {fullName , street, city, state, country, postalCode, phone } = req.body;
   const userId = req.user.id;

   // 2️. Validate required fields
   if (![fullName , street, city, state, country, postalCode, phone].every(Boolean)) {
      throw new ApiError(400, "All address fields are required");
   }

   // 3️. Optional: Check for existing duplicate address for the same user
   const existingAddress = await Address.findOne({
      userId,
      fullName,
      street,
      city,
      state,
      country,
      postalCode,
      phone,
   });

   if (existingAddress) {
      throw new ApiError(409, "Address already exists");
   }

   // 4️. Save to DB
   const address = await Address.create({
      userId,
      fullName,
      street,
      city,
      state,
      country,
      postalCode,
      phone,
   });

   // 5️. Return success
   return res
      .status(201)
      .json(new ApiResponse(201, address, "Address added successfully"));
});

const getUserAddress = asyncHandler(async (req, res) => {
   const userId = req.user.id; // secure, from auth middleware

   // Get all addresses associated with the user
   const addresses = await Address.find({userId });

   if (!addresses || addresses.length === 0) {
      throw new ApiError(404, "No addresses found for this user");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, addresses, "User addresses fetched successfully"),
      );
});

const updateAddress = asyncHandler(async (req, res) => {
   const addressId = req.params.id;
   const userId = req.user.id;
   const updateData = req.body;

   // Check if the address exists and belongs to the user
   const address = await Address.findOne({ _id: addressId, user: userId });

   if (!address) {
      throw new ApiError(404, "Address not found or not authorized");
   }

   // Update the address
   const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: updateData },
      { new: true, runValidators: true },
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedAddress, "Address updated successfully"),
      );
});

const deleteAddress = asyncHandler(async (req, res) => {
   const addressId = req.params.id;
   const userId = req.user.id;

   const address = await Address.findOne({ _id: addressId, user: userId });

   if (!address) {
      throw new ApiError(404, "Address not found or not authorized to delete");
   }

   await Address.deleteOne({ _id: addressId });

   return res
      .status(200)
      .json(new ApiResponse(200, null, "Address deleted successfully"));
});

const setDefaultAddress = asyncHandler(async (req, res) => {
   const addressId = req.params.id;
   const userId = req.user.id;

   const address = await Address.findOne({ _id: addressId, user: userId });

   if (!address) {
      throw new ApiError(404, "Address not found or not authorized");
   }

   // Unset all other addresses marked as default
   await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } },
   );

   // Set this address as default
   address.isDefault = true;
   await address.save();

   return res
      .status(200)
      .json(new ApiResponse(200, address, "Default address set successfully"));
});

export {
   addAddress,
   getUserAddress,
   updateAddress,
   deleteAddress,
   setDefaultAddress,
};
