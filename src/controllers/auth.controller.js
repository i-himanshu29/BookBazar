import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { User } from "../models/user.model.js";

import { emailVerificationMailgenContent } from "../utils/mail.util.js";

const registerUser = asyncHandler(async (req, res) => {
   const { email, name, password } = req.body;

   if ([name, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   try {
      const existingUser = await User.findOne({
         $or: [{ name }, { email }],
      });

      if (existingUser) {
         throw new ApiError(409, "User with email or username already exists");
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

export { registerUser };
