import { body, param } from "express-validator";
import { validate } from "../middlewares/validator.middleware.js";

const userRegistrationValidator = () => {
   return [
      body("name")
         .trim()
         .notEmpty()
         .withMessage("Name is required")
         .isLength({ min: 3 })
         .withMessage("Name should be atleast 3 character long")
         .isLength({ max: 20 })
         .withMessage("name cannot exceed 20 character"),
      body("email")
         .trim()
         .notEmpty()
         .withMessage("Email is required")
         .isEmail()
         .withMessage("Email is invalid"),
      body("password")
         .trim()
         .notEmpty()
         .withMessage("Password is required")
         .isLength({ min: 5 })
         .withMessage("Password must be at least 5 characters")
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
         .withMessage(
            "Password must contain at least one uppercase , one lowercase , one number and one special character",
         ),
      validate,
   ];
};

const loginValidator = () => {
   return [
      body("email")
         .trim()
         .notEmpty()
         .withMessage("email is required")
         .isEmail()
         .withMessage("Please enter a valid email"),
      body("password").trim().notEmpty().withMessage("password is required"),
   ];
};

const forgotPasswordValidator = () => {
   return [
      body("email")
         .trim()
         .notEmpty()
         .withMessage("Email is required")
         .isEmail()
         .withMessage("Please enter a valid email"),
   ];
};

const resetPasswordValidator = () => {
   return [
      param("token").trim().notEmpty().withMessage("Reset token is required"),

      body("password")
         .trim()
         .notEmpty()
         .withMessage("Password is required")
         .isLength({ min: 8 })
         .withMessage("Password must be at least 8 character")
         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
         .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
         ),
   ];
};

//For verification token validation
const verifyTokenValidator = () => {
   return [
      param("token")
         .trim()
         .notEmpty()
         .withMessage("Verification token is required"),
   ];
};
const userChangeCurrentPasswordValidator = () => {
   return [
     body("oldPassword").notEmpty().withMessage("Old password is required"),
     body("newPassword").notEmpty().withMessage("New password is required"),
   ];
 };
export {
   userRegistrationValidator,
   loginValidator,
   forgotPasswordValidator,
   resetPasswordValidator,
   verifyTokenValidator,
   userChangeCurrentPasswordValidator,
};
