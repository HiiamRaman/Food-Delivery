import { User } from "../models/user.model.js";
import { ApiError } from "./apiError.js";

export const generateTokensForUser = async (userId) => {
  try {
    //find user by database
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "user not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

 
    // we have to save refreshToken in db

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.log("token generation errors", error);
    throw new ApiError(400, "Something went wrong while generating tokens");
  }
};
