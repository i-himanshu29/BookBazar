import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { extractPublicId } from "cloudinary-build-url";

dotenv.config({
   path: "./.env",
});

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;

      //upload file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
         folder: "BookBazar",
         resource_type: "auto",
      });

      console.log("response:", response);

      fs.unlinkSync(localFilePath);
      return response;
   } catch (error) {
      console.error(error);
      return null;
   }
};

const deleteFromCloudinary = async (url) => {
   try {
      if (!url) return null;

      const publicId = extractPublicId(url);

      const response = await cloudinary.uploader.destroy(publicId);
      return response;
   } catch (error) {
      console.log("Error while deleteing the avatar or coverImage");
      return null;
   }
};

export { uploadOnCloudinary, deleteFromCloudinary };
