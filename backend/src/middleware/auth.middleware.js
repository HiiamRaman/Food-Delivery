import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/API/apiError.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  

  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;

  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    
  } else if (cookieToken) {
    token = cookieToken;
   
  }

  console.log("Final Token:", token);

  if (!token || token === "undefined" || token === "null") {
    console.log("❌ TOKEN MISSING");
    return next(new ApiError(401, "Token missing or invalid"));
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );


    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return next(new ApiError(404, "User not found"));
    }

  

    req.user = user;

    next();
  } catch (error) {
    console.log("JWT Verify Error:", error.message);

    return next(new ApiError(401, "Invalid Token"));
  }
});