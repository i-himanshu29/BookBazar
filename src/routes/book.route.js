import { Router } from "express";
import {
   addBookValidator,
   updateBookValidator,
} from "../validators/book.validator.js";
import {
   addBook,
   deleteBook,
   getAllBooks,
   getBookById,
   updateBook,
} from "../controllers/book.controller.js";
import { checkAdmin , verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/add-book").post(addBookValidator(), validate,verifyJWT, checkAdmin, addBook);
router.route("/").get(getAllBooks);
router.route("/:bookId").get(getBookById);
router
   .route("/:bookId")
   .patch(updateBookValidator(), validate, checkAdmin, updateBook);
router.route("/:bookId").delete(checkAdmin, deleteBook);

export default router;
