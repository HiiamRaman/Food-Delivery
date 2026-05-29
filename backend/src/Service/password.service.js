import bcrypt from "bcrypt";

import { ApiError } from "../utils/API/apiError.js";
import { User } from "../models/user.model.js";

export const changePasswordService = async ({
  userId,
  oldPassword,
  newPassword,
}) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;
  await user.save();
  return true;
};
