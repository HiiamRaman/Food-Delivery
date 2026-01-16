import { Cart } from "../models/cart.model.js";
import User from "../models/user.model.js";
import asynchandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
export const addToCart = asynchandler(async (req, res) => {
  /**
   *  Mental Flow:
   * 1. Get authenticated user from req.user (from JWT middleware)
   * 2. Get foodId and quantity from request body
   * 3. Validate foodId
   * 4. Check if user already has an active cart
   * 5. If no cart → create new cart with the item
   * 6. If cart exists:
   *    a) Check if item already exists in cart
   *    b) If exists → increase quantity
   *    c) If not → push new item
   * 7. Save cart
   * 8. Return updated cart in response
   */

  //   Get authenticated user from req.user
  const userId = req.user._id;
  //  2. Get foodId and quantity from request body

  const { foodId, quantity = 1 } = req.body;

  // 3️⃣ Validate input
  if (!foodId) {
    throw new ApiError(400, "foodId is requried !!");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // 4️⃣ Find active cart for the user

  let cart = await Cart.findOne({ user: userId, isActive: true });
  // 5️⃣ If no cart exists → create new

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      item: [{ food: foodId, quantity }],
    });
  }
  // 6️⃣ Cart exists → check if food already exists in cart

  const itemIndex = cart.item.findIndex((item) => {
    return item.food.toString() === foodId;
  });

  if (itemIndex > -1) {
    // 6b) Food exists → increase quantity
    cart.item[itemIndex].quantity += quantity;
  } else {
    // 6c) Food does not exist → push new item

    cart.item.push({ food: foodId, quantity });
  }
  // 7️⃣ Save updated cart
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Item added to new cart "));
});
export const removeCart = asynchandler(async (req, res) => {
/**
   *  Mental Flow:
   * 1. Get authenticated user from req.user
   * 2. Get foodId from request body or params
   * 3. Validate foodId
   * 4. Find active cart for the user
   * 5. If no cart → return error
   * 6. Check if the item exists in cart
   * 7. If exists → remove item
   * 8. Save updated cart
   * 9. Return updated cart in response
   */



});
