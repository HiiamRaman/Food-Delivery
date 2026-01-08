import { Food } from "../models/food.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const addFood = asyncHandler(async (req, res) => {
  /*
MENTAL FLOW – addFood Controller

 Multer handles file upload (req.file)
Extract name, price, description, category from req.body
 Validate required fields (file, name, price, category)
 Upload file to Cloudinary
 Prepare food object with details + Cloudinary URL
 Save food in database
 Send success response (ApiResponse)
 Catch any errors (ApiError)
*/
  // Multer handles file upload (req.file)
  const file = req.file;
  if (!file) {
    throw new ApiError(400, "Image is required!!");
  }
  // Extract name, price, description, category from req.body
  const { name, price, description, category } = req.body;

  //  Validate required fields
  if (!name || !price || !category) {
    throw new ApiError(400, "All Fields are required!!");
  }
  //  Upload file to Cloudinary
  const uploaded = await uploadOnCloudinary(file.path);
  if (!uploaded) {
    throw new ApiError(400, "Failed to upload image");
  }

  //  Save food in database

  const foodData = {
    name,
    price,
    description: description || "",
    category,
    image: uploaded.secure_url,
  };

  const newFood = await Food.create(foodData);

  return res
    .status(200)
    .json(new ApiResponse(200, { newFood }, "Food added Successfully!!"));
});

export const listFood = asyncHandler(async (req, res) => {
  /*
  Mental Flow:
  1. Request hits the listFood route
  2. Fetch all food items from the database
  3. Store the result in a variable
  4. Send success response with food data
  */

  const foods = await Food.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: foods.length, foods },
        "Food fetched successfully!!"
      )
    );
});

export const removeFoodItem = asyncHandler(async (req, res) => {
  /*
  Mental Flow:
  1. Request hits the removeFoodItem route
  2. Extract food ID from request parameters
  3. Find food item by ID and delete it
  4. If food does not exist, throw error
  5. Return success response after deletion
  */

  const  {id}  = req.params
  if(!id){
    throw new ApiError(400,"Invalid id or id is required");
    
  }

  // 2. Extract food ID from request parameters

  const food = await Food.findByIdAndDelete(id);

  if (!food) {
    throw new ApiError(404, "Food item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "FoodItem successfully deleted!!"));
});
