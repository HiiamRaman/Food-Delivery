import { verify } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  /**
   *  MENTAL FLOW (INDUSTRY STANDARD):
   * 1. Extract token from Authorization header
   * 2. Validate token format
   * 3. Verify token signature & expiry
   * 4. Validate userId from token
   * 5. Fetch user from DB
   * 6. Attach user to req
   * 7. Allow request to proceed
   */
  // 1️⃣ Extract Authorization header

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError(400, "Authorization header missing");
  }
  // 2️⃣ Validate Bearer token format
  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Invalid token format");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  // 3️ Verify token

  const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

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
