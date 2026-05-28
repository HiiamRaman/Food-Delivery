
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "server is running !!"));
});
