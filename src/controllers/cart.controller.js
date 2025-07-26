import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { Cart } from "../models/cartItem.model.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
   // 1️. Get book ID from req.params
   const { bookId } = req.params;

   // 2️. Get quantity from req.body (default to 1)
   const { quantity = 1 } = req.body;

   // 3️. Get user ID from req.user (assumes auth middleware has set req.user)
   const userId = req.user.id;

   // 4️. Validate book ID format
   if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError(400, "Invalid book ID");
   }

   // 5️. Check if book exists
   const book = await Book.findById(bookId);
   if (!book) {
      throw new ApiError(404, "Book not found");
   }

   // 6️. Check if item already exists in cart → update quantity if yes
   const existingCartItem = await Cart.findOne({
      userId: userId,
      bookId: bookId,
   });

   let cartItem;

   if (existingCartItem) {
      existingCartItem.quantity += quantity;
      cartItem = await existingCartItem.save();
   } else {
      cartItem = await Cart.create({
         userId: userId,
         bookId: bookId,
         quantity,
      });
   }

   // 8️. Return success response
   return res
      .status(201)
      .json(new ApiResponse(200, cartItem, "Item added to cart successfully"));
});

const getCartItems = asyncHandler(async (req, res) => {
   // 1️. Get user ID from req.user (set via auth middleware)
   const userId = req.user.id;

   // 2️. Query the cart collection to find items for the user
   const cartItems = await Cart.find({ userId }).populate("bookId");

   // 3️. If no items found, return an appropriate message
   if (!cartItems || cartItems.length === 0) {
      throw new ApiError(404, "No items found in cart");
   }

   // 4️. Return the cart items in response
   return res
      .status(200)
      .json(
         new ApiResponse(200, cartItems, "Cart items retrieved successfully"),
      );
});

const removeFromCart = asyncHandler(async (req, res) => {
   // 1️. Get cart item ID from req.params (e.g., /cart/:cartItemId)
   const { cartItemId } = req.params;

   // 2️. Get user ID from authenticated request
   const userId = req.user.id;

   console.log(
      "Attempting to remove cart item:",
      cartItemId,
      "for user:",
      userId,
   );

   // Check if ID is valid
   if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      throw new ApiError(400, "Invalid cart item ID");
   }

   // Check if cart item exists at all
   // const rawCartItem = await Cart.findById(cartItemId);
   // console.log("Cart item without user check:", rawCartItem);

   // if (!rawCartItem) {
   //    throw new ApiError(404, "Cart item does not exist");
   // }

   // 4️. Remove the cart item from the database
   await Cart.findByIdAndDelete(cartItemId);

   // 5️. Return success response
   return res
      .status(200)
      .json(new ApiResponse(200, null, "Item removed from cart successfully"));
});

export { addToCart, getCartItems, removeFromCart};
