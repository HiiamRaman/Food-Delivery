import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  /**
 * MENTAL FLOW:
 * 1. Extract token from cookie or Authorization header
 * 2. Verify token signature & expiry
 * 3. Validate userId from token
 * 4. Fetch user from DB
 * 5. Attach user to req
 * 6. Allow request to proceed
 */


  const token =  req.cookies?.accessToken ||   req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  // 3️ Verify token

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // 4. Validate userId from token

  if (!decodedToken?._id) {
    throw new ApiError(401, "Invalid Token");
  }
  // 5️ Fetch user from database

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 6. Attach user to req

  req.user = user;
  next();
});



