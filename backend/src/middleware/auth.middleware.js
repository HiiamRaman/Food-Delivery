// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   /**
//    *  MENTAL FLOW (INDUSTRY STANDARD):
//    * 1. Extract token from Authorization header
//    * 2. Validate token format
//    * 3. Verify token signature & expiry
//    * 4. Validate userId from token
//    * 5. Fetch user from DB
//    * 6. Attach user to req
//    * 7. Allow request to proceed
//    */
//   // 1️⃣ Extract Authorization header

//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     throw new ApiError(400, "Authorization header missing");
//   }
//   // 2️⃣ Validate Bearer token format
//   if (!authHeader.startsWith("Bearer ")) {
//     throw new ApiError(401, "Invalid token format");
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     throw new ApiError(401, "Token missing");
//   }

//   // 3️ Verify token

//   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//   // 4. Validate userId from token

//   if (!decodedToken?._id) {
//     throw new ApiError(401, "Invalid Token");
//   }
//   // 5️ Fetch user from database

//   const user = await User.findById(decodedToken._id).select(
//     "-password -refreshToken"
//   );

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // 6. Attach user to req

//   req.user = user;
//   next();
// });









import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
 

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw new ApiError(401, "Token missing");
  

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken",
  );
  if (!user) throw new ApiError(404, "User not found");
  

  req.user = user;

  // ✅ THIS IS CRITICAL
  next();
});












// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/apiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
  
//   console.log("\n================ JWT DEBUG START ================\n");

//   // 1. RAW HEADERS
//   console.log("🧠 HEADERS:", req.headers);

//   const authHeader = req.headers.authorization;
//   console.log("🔐 AUTH HEADER:", authHeader);

//   if (!authHeader) {
//     console.log("❌ No authorization header found");
//     throw new ApiError(401, "Authorization token missing or invalid");
//   }

//   if (!authHeader.startsWith("Bearer ")) {
//     console.log("❌ Header does not start with Bearer");
//     throw new ApiError(401, "Invalid token format");
//   }

//   // 2. TOKEN EXTRACTION
//   const token = authHeader.split(" ")[1];
//   console.log("🔐 EXTRACTED TOKEN:", token);

//   if (!token || token === "undefined") {
//     console.log("❌ Token is missing or undefined");
//     throw new ApiError(401, "Token missing");
//   }

//   // 3. ENV CHECK
//   console.log("🔑 ACCESS TOKEN SECRET:", process.env.ACCESS_TOKEN_SECRET);

//   if (!process.env.ACCESS_TOKEN_SECRET) {
//     console.log("❌ JWT secret is undefined in environment");
//     throw new ApiError(500, "Server misconfiguration");
//   }

//   // 4. VERIFY TOKEN
//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     console.log("✅ DECODED TOKEN:", decoded);
//   } catch (err) {
//     console.log("❌ JWT VERIFY ERROR:", err.message);
//     throw new ApiError(401, `Invalid token: ${err.message}`);
//   }

//   // 5. USER FETCH
//   console.log("👤 LOOKING FOR USER ID:", decoded._id);

//   const user = await User.findById(decoded._id).select(
//     "-password -refreshToken"
//   );

//   if (!user) {
//     console.log("❌ User not found in DB");
//     throw new ApiError(404, "User not found");
//   }

//   console.log("✅ USER FOUND:", user.email);

//   req.user = user;

//   console.log("\n================ JWT DEBUG END ================\n");

//   next();
// });