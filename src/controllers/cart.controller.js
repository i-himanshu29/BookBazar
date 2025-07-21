import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { Cart } from "../models/cartItem.model.js";
import {Book} from "../models/book.model.js"

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
   const existingCartItem = await Cart.findOne({ user: userId, book: bookId });

   if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
   } else {
      // 7️. Create new cart item if not already in cart
      await Cart.create({
         user: userId,
         book: bookId,
         quantity,
      });
   }

   // 8️. Return success response
   return res
      .status(201)
      .json(new ApiResponse(200, null, "Item added to cart successfully"));
});

const getCartItems = asyncHandler(async (req, res) => {
   // 1️. Get user ID from req.user (set via auth middleware)
   const userId = req.user.id;

   // 2️. Query the cart collection to find items for the user
   const cartItems = await Cart.find({ user: userId }).populate("book");

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

   // 3️. Find the cart item and check if it belongs to the user
   const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

   if (!cartItem) {
      throw new ApiError(404, "Cart item not found or unauthorized");
   }

   // 4️. Remove the cart item from the database
   await Cart.findByIdAndDelete(cartItemId);

   // 5️. Return success response
   return res
      .status(200)
      .json(new ApiResponse(200, null, "Item removed from cart successfully"));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
   // 1️. Extract cart item ID and new quantity from req.body
   const { cartItemId, quantity } = req.body;

   // 2️. Basic validation
   if (!cartItemId || typeof quantity !== "number" || quantity < 1) {
      throw new ApiError(400, "Valid cartItemId and quantity are required");
   }

   // 3️. Get user ID from the authenticated request
   const userId = req.user.id;

   // 4️. Check if the cart item exists and belongs to the user
   const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

   if (!cartItem) {
      throw new ApiError(404, "Cart item not found or unauthorized");
   }

   // 5️. Update the quantity in the database
   cartItem.quantity = quantity;
   await cartItem.save();

   // 6️. Return a success response
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            cartItem,
            "Cart item quantity updated successfully",
         ),
      );
});

export { addToCart, getCartItems, removeFromCart, updateCartItemQuantity };
