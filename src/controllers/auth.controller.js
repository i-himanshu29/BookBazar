import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { User } from "../models/user.model.js";
import {
   sendEmail,
   emailVerificationMailgenContent,
} from "../utils/mail.util.js";
import crypto from "crypto"

const registerUser = asyncHandler(async (req, res) => {
   const { email, name, password } = req.body;

   if ([name, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   try {
      const existingUser = await User.findOne({
         email,
      });

      if (existingUser) {
         throw new ApiError(409, "User with email already exists");
      }

      const user = await User.create({
         name,
         email,
         password,
      });

      const token = user.generateTemporaryToken();

      user.emailVerificationToken = token.hashedToken;
      user.emailVerificationExpiry = token.hashedExpiry;

      await user.save();

      await sendEmail({
         email,
         subject: "Verify your email",
         mailgenContent: emailVerificationMailgenContent(
            name,
            `${process.env.BASE_URL}/api/v1/users/verify/${token.unHashedToken}`,
         ),
      });

      const createUser = await User.findById(user._id).select(
         "-password -refreshToken",
      );

      if (!createUser) {
         throw new ApiError(
            500,
            "Something went wrong while registering the user",
         );
      }
      return res
         .status(201)
         .json(
            new ApiResponse(200, createUser, "User Registered Successfully"),
         );
   } catch (error) {
      throw new ApiError(
         error?.statusCode || 500,
         error?.message || "Internal Server Error",
      );
   }
});

const verifyUser = asyncHandler(async (req, res) => {
   const { token } = req.params;
   console.log(token);

   if (!token) {
      throw new ApiError(400, "Invalid Token");
   }

   try {
      const hashedToken = crypto
         .createHash("sha256")
         .update(token)
         .digest("hex");
      const user = await User.findOne({
         emailVerificationToken: hashedToken,
         emailVerificationExpiry: { $gt: Date.now() },
      });

      if (!user) {
         throw new ApiError(400, "Invalid token");
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpiry = undefined;

      await user.save();

      return res
         .status(201)
         .json(new ApiResponse(200, user, "Email verified Successfully"));
   } catch (error) {
      console.log("Verification failed",error);
      throw new ApiError(
         error.statusCode || 500,
         error?.message || "Internal server error",
      );
   }
});

export { registerUser ,verifyUser};
