import jwt from "jsonwebtoken";
import db from "../config/dbconnect.config.js";
import { ApiError } from "../utils/api-error.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
   if (!token) {
      throw new ApiError(401, "Unauthorized request");
   }
   try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
         "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );

      if (!user) {
         throw new ApiError(401, "Invalid access token");
      }
      req.user = user;
      next();
   } catch (error) {
      throw new ApiError(400, error?.message || "Invalid access Token");
   }
});

export const checkAdmin = asyncHandler(async (req, res, next) => {
   try {
      // const userId = req.user.id;
      const user = await User.findById(req.user.id).select("role");
      if (!req.user || !req.user.id) {
         return res.status(401).json({ message: "Unauthorized - user not found" });
      }
   
    
   
      // const user = await db.user.findUnique({
      //    where: {
      //       id: userId,
      //    },
      //    select: {
      //       role: true,
      //    },
      // });

      if (!user || user.role !== "admin") {
         return res.status(403).json({
            message: "Access denied - Admins only",
         });
      }
      next();
   } catch (error) {
      console.log("Error checking admin role", error);
      res.status(500).json({ message: "Error checking admin role" });
   }
});
