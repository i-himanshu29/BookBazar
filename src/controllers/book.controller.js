import { asyncHandler } from "../utils/async-handler.util.js";
import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import {uploadOnCloudinary} from "../config/cloudinary.config.js"
import mongoose from "mongoose";

const addBook = asyncHandler(async (req, res) => {
   // 1️ .Extract data from request body
   const { title, description, author, price, stock } = req.body;

   // 2. Upload image to Cloudinary
   const uploadResult = await uploadOnCloudinary(req.file.path);

   if (!uploadResult || !uploadResult.secure_url) {
      throw new ApiError(500, "Image upload failed");
   }

   const imageUrl = uploadResult.secure_url;

   // 3️. Check if the book already exists (based on title and author or other unique fields)
   const existingBook = await Book.findOne({ title, author });
   if (existingBook) {
      // return res.status(400).json({ message: "Book already exists" });
      throw new ApiError(
         400,
         "Book already exists",
      );
   }

   // 4️ .Create and save the new book in DB
   const book = await Book.create({
      title,
      imageUrl,
      description,
      author,
      price:parseFloat(price),
      stock:parseInt(stock, 10),
   });

   // 5.return success response
   return res
      .status(201)
      .json(new ApiResponse(200, book, "Book added successfully"));
});

const getAllBooks = asyncHandler(async (req, res) => {
   // 1. Optionally, extract query parameters (e.g., search, pagination)
   const { search, page = 1, limit = 10 } = req.query;

   const query = {};

   if (search) {
      query.title = { $regex: search, $options: "i" };
   }

   // 2. Fetch books from DB
   const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

   // 3. Return response (empty array is fine)
   return res
      .status(200)
      .json(new ApiResponse(200, books, "Books fetched successfully"));
});

const getBookById = asyncHandler(async (req, res) => {
   // 1️. Get book ID from req.params
   const { bookId } = req.params;

   // 2️. Validate if ID is a valid MongoDB ObjectId (optional but recommended)
   if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError(400, "Invalid book ID format");
   }

   // 3️. Fetch book from DB by ID
   const book = await Book.findById(bookId);

   // 4️. If no book found, throw error
   if (!book) {
      throw new ApiError(404, "Book not found");
   }

   // 5️. Return book with success response
   return res
      .status(200)
      .json(new ApiResponse(200, book, "Book fetched successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
   // 1️. Extract book ID from req.params
   const { bookId  } = req.params;

   // 2️. Validate book ID format
   if (!mongoose.Types.ObjectId.isValid(bookId )) {
      throw new ApiError(400, "Invalid book ID");
   }

   // 3️. Extract updated data from req.body
   const { title, imageUrl, description, author, price, stock } = req.body;

   // 4️. Optional: Validate fields if needed
   // You can apply basic checks or rely on middleware
   if (
      [title, imageUrl, description, author].some(
         (field) => typeof field === "string" && field.trim() === "",
      )
   ) {
      throw new ApiError(400, "Required fields cannot be empty");
   }

   // 5️. Find and update the book in DB
   const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, imageUrl, description, author, price, stock },
      { new: true, runValidators: true },
   );

   // 6️. If no book found
   if (!updatedBook) {
      throw new ApiError(404, "Book not found");
   }

   // 7️. Return success response
   return res
      .status(200)
      .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

const deleteBook = asyncHandler(async (req, res) => {
   // 1️. Extract book ID from req.params
   const { bookId } = req.params;

   // 2️. Validate the book ID format
   if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError(400, "Invalid Book ID");
   }

   // 3️. Check if book exists
   const existingBook = await Book.findById(bookId);
   if (!existingBook) {
      throw new ApiError(404, "Book not found");
   }

   // 4️. Delete the book
   await Book.findByIdAndDelete(bookId);

   // 5️. Return success response
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Book deleted successfully"));
});

export { 
    addBook, 
    getAllBooks, 
    getBookById, 
    updateBook, 
    deleteBook,
};
