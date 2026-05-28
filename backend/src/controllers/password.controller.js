import { changePasswordService } from "../Service/password.service.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both password are required !!");
  }
  // optional validation
  if (newPassword.length < 7) {
    throw new ApiError(400, "New password must be at least 7 characters");
  }

  await changePasswordService({
    userId: req.user._id,
    oldPassword,
    newPassword,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed SuccessFully!!"));
});
