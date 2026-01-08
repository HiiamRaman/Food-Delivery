import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { generateTokensForUser } from "../utils/service.tokens.js";
//register user
export const registerUser = asyncHandler(async (req, res) => {
  /*
MENTAL FLOW (High level)
1. Extract required fields from request body
2. Validate input (basic safety checks)
3. Check if user already exists
4. Hash password (never store raw passwords)
5. Create user document with default values
6. Save user to database
7. Send safe response (never send password)
*/
  // 1. Extract required fields from request body
  const { name, fullname, email, password } = req.body;

  // Validate input (basic safety checks)
  if (!name || !fullname || !email || !password) {
    throw new ApiError(400, "All Fields are Required");
  }
  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exist");
  }

  // 5. Create user instance (cartdata initialized automatically)
  const user = new User({
    name,
    fullname,
    email,
    password,
    cartdata: [],
  });
  // Save user to database
  await user.save();

  // Send safe response

  //   before send res we have to remove password for security

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User Registered Successfully!!"));
});
//login  user
export const loginUser = asyncHandler(async (req, res) => {
  /*
  MENTAL FLOW:
  1. Extract email and password from request
  2. Validate input
  3. Find user by email
  4. Compare entered password with hashed password
  5. Generate JWT access token
  6. Build safe user object (exclude password)
  7. Send response with token and safe user
  */
  // Extract login credentials from request body
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    throw new ApiError(400, " Email and Passwords are required!");
  }

  //  Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not Found!!");
  }
  // 4. Compare entered password with hashed password
  const isCorrect = await user.isPasswordCorrect(password);

  if (!isCorrect) {
    throw new ApiError(401, "invalid password or email");
  }

  //  5. Generate JWT access token
  const { accessToken, refreshToken } = await generateTokensForUser(user._id);

  const userData = user.toObject(); //converts it to a plain JavaScript object
  delete userData.password;
  delete userData.refreshToken;
  //cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);
  //  Build safe user object (exclude password)

  return res
    .status(200)
    .json(new ApiResponse(200, { userData, accessToken }, "Login successFull"));
});
