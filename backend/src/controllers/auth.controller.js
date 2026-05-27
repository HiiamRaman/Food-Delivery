import { User } from "../models/user.model.js";

import validator from "validator";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { generateTokensForUser } from "../utils/service.tokens.js";
import { Cart } from "../models/cart.model.js";
import { OTP } from "../models/otp.model.js";
import { generateOTP } from "../Service/otp.service.js";
import { sendEmail } from "../Service/email.service.js";
import jwt from "jsonwebtoken";

//register user
export const registerUser = asyncHandler(async (req, res) => {
  /*
  MENTAL FLOW (Production OTP System)

  1. Extract user input
  2. Validate required fields
  3. Check if user already exists
  4. Create user (NOT verified yet)
  5. Generate OTP
  6. Store OTP in DB
  7. Send OTP email
  8. Return success response
  */
  // 1. Extract required fields from request body
  const { username, fullname, email, password } = req.body;

  // Validate input (basic safety checks)
  if (!username || !fullname || !email || !password) {
    throw new ApiError(400, "All Fields are Required");
  }
  // 3. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exist");
  }

  // 5. Create user instance (cartdata initialized automatically)
  const user = new User({
    username,
    fullname,
    email,
    password,
    cartdata: [],
    isVerified:false
  });
  // Save user to database
  await user.save();
//Generate OTP
const otp = generateOTP();
//store otp
await OTP.create({
  email,
  otp,
  expiresAt:Date.now()+5*60*1000  //5min
});

//send email
await sendEmail({
  to:email,
  subject:"OTP-Verification - Food Delivery App",
  html: `
      <h2>Verify Your Account</h2>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `

})




  

  // Send safe response

  //   before send res we have to remove password for security

  return res
    .status(200)
    .json(new ApiResponse(200, { email , message:"OTP sent to email"}, "User Registered Successfully!!"));
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
 //ADD LOGIN PROTECTION ONLY VERIFIED USER CAN LOGIN
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
  //iLOGIN PROTECTION
  if(!user.isVerified){
    
    throw new ApiError(403,"Please verify Your Account")
  }
  // 4. Compare entered password with hashed password
  const isCorrect = await user.isPasswordCorrect(password);

  if (!isCorrect) {
    throw new ApiError(401, "invalid password or email");
  }

  //  5. Generate JWT access token
  const { accessToken, refreshToken } = await generateTokensForUser(user._id);
  await Cart.findOneAndUpdate(
    { user: user._id },
    { $set: { item: [] } }, // clears cart items
    { new: true, upsert: true },
  );
  const userData = user.toObject(); //converts it to a plain JavaScript object
  delete userData.password;
  delete userData.refreshToken;
  //cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.cookie("accessToken", accessToken, cookieOptions);

  //  Build safe user object (exclude password)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userData, accessToken },
        "Login successFull",
      ),
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  //   1. Read refresh token (from cookie)
  // 2. Verify it (JWT check)
  // 3. Find user in DB
  // 4. Validate token matches DB
  // 5. Generate new access token
  // 6. (optionally rotate refresh token)
  // 7. Send new access token

  // 1. get refresh token from cookie
  console.log("HEADERS:", req.headers.cookie);
console.log("COOKIES:", req.cookies);
  const incomingRefreshToken = req.cookies.refreshToken;
  console.log("INCOMING REFRESH:", incomingRefreshToken);


  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is missing");
  }
  // 2. verify refresh token

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  // 3. find user
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  // 4. validate refresh token matches DB

  if (user.refreshToken !== incomingRefreshToken) {
    console.log("DB REFRESH:", user.refreshToken);
    throw new ApiError(401, "Invalid Refresh Token");
  }
  // 5. generate new access token
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();
  console.log("NEW REFRESH:", newRefreshToken);
  // save new refresh token in DB;
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  // cookie options
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/", // important
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "Tokens regenrated successfully!!",
      ),
    );
});

export const getcurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "Admin authenticated successfully",
      ),
    );
});



export const verifyOTP = asyncHandler(async(req,res)=>{
   /*
  FLOW:
  1. Get email + otp from user
  2. Find OTP record
  3. Check expiry
  4. Verify user
  5. Delete OTP
  */
const {email,otp} = req.body;


//find otp

const otpRecord  = await OTP.findOne({email,otp});
if(!otpRecord){
  throw new ApiError(400,"Otp  not found")
}

//check expiry
if(otpRecord.expiresAt < Date.now()){
  throw new ApiError(400,"OTP already Expired ")
}
// veify user
await User.updateOne({email},{isVerified:true})

//delete otp after success 

await OTP.deleteMany({email});


return res.status(200).json(new ApiResponse(200,{},"Email Verified Successfully"))

})