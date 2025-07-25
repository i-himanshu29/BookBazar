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
import { checkAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
   "/add-book",
   verifyJWT,
   checkAdmin,
   upload.single("image"),
   addBookValidator(),
   validate,
   addBook,
);
router.route("/").get(getAllBooks);
router.route("/:bookId").get(getBookById);
router.patch(
   "/:bookId",
   verifyJWT,
   checkAdmin,
   upload.single("image"),
   updateBookValidator(),
   validate,
   updateBook,
);
router.route("/:bookId").delete(verifyJWT , checkAdmin, deleteBook);

export default router;
