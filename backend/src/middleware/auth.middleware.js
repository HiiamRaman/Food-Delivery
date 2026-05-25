



import {User} from '../models/user.model.js'
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }catch (error) {
  console.log("JWT ERROR:", error.message);
  throw new ApiError(401, "Invalid Token");
}

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});