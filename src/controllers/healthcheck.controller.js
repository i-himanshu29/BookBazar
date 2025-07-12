import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";

const healthcheck = asyncHandler(async (req, res) => {
   try {
      console.log("checking database connection...");
      res.status(200).json(
         new ApiResponse(200, { message: "Server is running" }),
      );
   } catch (error) {
      console.log("Healthcheck failed:", error);

      res.status(500).json(
         new ApiError(500, "Server is not running due to internal error"),
      );
   }
});

export { healthcheck };
