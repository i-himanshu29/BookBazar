import { asyncHandler } from "../utils/async-handler.util.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { User } from "../models/user.model.js";
import {
   sendEmail,
   emailVerificationMailgenContent,
   forgotPasswordMailgenContent,
} from "../utils/mail.util.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateRefreshAccessTokens = async (userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         500,
         "Something went wrong while generating refresh and access token",
      );
   }
};

const registerUser = asyncHandler(async (req, res) => {
   const { email, name, password,role } = req.body;

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
         role,
      });

      const token = user.generateTemporaryToken();

      user.emailVerificationToken = token.hashedToken;
      user.emailVerificationExpiry = token.tokenExpiry;

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
      console.log("Verification failed", error);
      throw new ApiError(
         error.statusCode || 500,
         error?.message || "Internal server error",
      );
   }
});

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email && !password) {
      throw new ApiError(400, "email and password is required");
   }

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(401, "Invalid user credentials");
   }

   const { accessToken, refreshToken } = await generateRefreshAccessTokens(
      user._id,
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
   );

   const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser,
               accessToken,
               refreshToken,
            },
            "User logged In successfully",
         ),
      );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

   if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
   }

   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET,
      );
      console.log("decodeToken", decodedToken);

      const user = await User.findById(decodedToken?._id);
      if (!user) {
         throw new ApiError(401, "Invalid refresh Token");
      }
      console.log("user", user);
      if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Invalid token is expired or used");
      }

      const options = {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "Strict",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      const { accessToken, newRefreshToken } =
         await generateRefreshAccessTokens(user._id);

      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(
            new ApiResponse(
               200,
               { accessToken, refreshToken: newRefreshToken },
               "Access token refreshed",
            ),
         );
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
   }
});

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1,
         },
      },
      {
         new: true,
      },
   );

   const options = {
      httpOnly: true,
      secure: true,
   };
   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
   const { _id, email } = req.user;

   try {
      const user = await User.findOne({ _id });
      if (!user) {
         throw new ApiError(404, "User not found");
      }

      const { unHashedToken, hashedToken, tokenExpiry } =
         user.generateTemporaryToken();
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpiry = tokenExpiry;
      await user.save();

      try {
         await sendEmail({
            email: user.email,
            subject: "verify tour email",
            mailgenContent: emailVerificationMailgenContent(
               user.name,
               `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
            ),
         });
      } catch (error) {
         throw new ApiError(
            error?.statusCode || 500,
            error?.message || "something went wrong while sending mail",
         );
      }

      res.status(201).json(
         new ApiResponse(201, user, "Email verification Link sent"),
      );
   } catch (error) {
      throw new ApiError(500, "Internal Server error");
   }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
   try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
         throw new ApiError(400, "User email doesn't exist");
      }
   
      console.log(user);
   
      const { unHashedToken, hashedToken, tokenExpiry } =
         user.generateTemporaryToken();
      user.forgotPasswordToken = hashedToken;
      user.forgotPasswordExpiry = tokenExpiry;
      await user.save();
   
      try {
         sendEmail({
            email,
            subject: "Reset Password",
            mailgenContent: forgotPasswordMailgenContent(
               user.name,
               `${process.env.BASE_URL}/api/v1/users/reset-password/${unHashedToken}`,
            ),
         });
      } catch (error) {
         throw new ApiError(
            error?.statusCode || 500,
            error?.message || "Something went wrong while sending mail",
         );
      }
      res.status(201).json(new ApiResponse(201, user, "Reset Password Link Sent"));
   } catch (error) {
      throw new ApiError(500, error?.message || "Internal Server Error");
   }
});

const changeCurrrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   const user = await User.findById(req.user?._id);
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

   if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old Password");
   }
   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res.status(200).json(new ApiResponse(200, {}, "Password changed"));
});

const getProfile = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
   registerUser,
   verifyUser,
   loginUser,
   refreshAccessToken,
   logoutUser,
   resendVerificationEmail,
   forgotPasswordRequest,
   changeCurrrentPassword,
   getProfile,
};
