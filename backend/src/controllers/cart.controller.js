import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { Food } from "../models/food.model.js";

import mongoose from "mongoose";
import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";
// export const addToCart = asyncHandler(async (req, res) => {
//   /**
//    * Mental Flow:
//    * 1. Get authenticated user from req.user
//    * 2. Get foodId and quantity from request body
//    * 3. Validate inputs
//    * 4. Find active cart for the user
//    * 5. If no cart → create new cart
//    * 6. If cart exists:
//    *    a) Check if item exists → increase quantity
//    *    b) Else → push new item
//    * 7. Save updated cart
//    * 8. Calculate totalAmount
//    * 9. Return updated cart + totalAmount
//    */

//   //   Get authenticated user from req.user
//   const userId = req.user._id;
//   //  2. Get foodId and quantity from request body

//   const { foodId, quantity = 1 } = req.body;

//   // 3️⃣ Validate input
//   if (!foodId) {
//     throw new ApiError(400, "foodId is requried !!");
//   }

//   if (quantity < 1) {
//     throw new ApiError(400, "Quantity must be at least 1");
//   }
//   const food = await Food.findById(foodId);
//   if (!food) throw new ApiError(404, "Food not found");

//   // 4️⃣ Find active cart for the user

//   let cart = await Cart.findOne({ user: userId, isActive: true }).populate(
//     "item.food",
//   );
//   // 5️⃣ If no cart exists → create new

//   if (!cart) {
//     cart = await Cart.create({
//       user: userId,
//       item: [{ food: foodId, quantity, price: food.price }],
//     });

//     await cart.populate("item.food"); // populate food details
//     const totalAmount = cart.item.reduce(
//       (sum, cartItem) => sum + cartItem.food.price * cartItem.quantity,0
//     );
//     return res
//       .status(200)
//       .json(new ApiResponse(200, { cart, totalAmount }, "item added to cart"));
//   }
//   // 6️⃣ Cart exists → check if food already exists in cart

//   const itemIndex = cart.item.findIndex((item) => {
//     return item.food._id.toString() === foodId.toString();
//   });

//   if (itemIndex > -1) {
//     // 6b) Food exists → increase quantity
//     cart.item[itemIndex].quantity += quantity;
//   } else {
//     // 6c) Food does not exist → push new item

//     cart.item.push({ food: foodId, quantity, price: food.price });
//   }
//   // 7️⃣ Save updated cart
//   await cart.save();
//   await cart.populate("item.food");
//   // 8️⃣ Calculate totalAmount
//   const totalAmount = cart.item.reduce(
//     (sum, i) => sum + i.food.price * i.quantity,
//     0,
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, { cart, totalAmount }, "Item added to  cart "));
// });

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { foodId } = req.body;
  let { quantity = 1 } = req.body;

  if (!foodId) throw new ApiError(400, "foodId is required");

  quantity = Number(quantity);
  if (isNaN(quantity) || quantity < 1)
    throw new ApiError(400, "Quantity must be at least 1");

  const food = await Food.findById(foodId);
  if (!food) throw new ApiError(404, "Food not found");

  const price = Number(food.price || 0);

  // ✅ ALWAYS GET OR CREATE CART CLEANLY
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      item: [],
    });
  }

  // 🧠 REMOVE INVALID ITEMS (VERY IMPORTANT FIX)
  cart.item = cart.item.filter(i => i.food && i.quantity > 0);

  // ✅ CHECK EXISTING ITEM
  const index = cart.item.findIndex(
    (i) => i.food.toString() === foodId.toString()
  );

  if (index > -1) {
    cart.item[index].quantity += quantity;
  } else {
    cart.item.push({
      food: food._id,
      quantity,
      price,
    });
  }

  await cart.save();
  await cart.populate("item.food");

  const totalAmount = cart.item.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return res.status(200).json({
    success: true,
    data: { cart, totalAmount },
  });
});

export const removeCart = asyncHandler(async (req, res) => {
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
  const userId = req.user._id;
  const { foodId } = req.params;
  // Validate foodId
  if (!foodId) {
    throw new ApiError(400, "FoodId is required !!");
  }
  // Find active cart for the user
  const cart = await Cart.findOne({ user: userId, isActive: true });
  if (!cart) {
    throw new ApiError(404, "No active cart is found for this User");
  }

  //  Check if the item exists in cart

  const itemIndex = cart.item.findIndex((item) => {
    return item.food.toString() === foodId;
  });
  // If item does not exist → return error

  if (itemIndex === -1) {
    throw new ApiError(404, "Food item not found in  cart");
  }

  //Remove Item
  cart.item.splice(itemIndex, 1); //remove 1 element at index
  //   array.splice(startIndex, deleteCount)
  // startIndex → where to start
  // deleteCount → how many items to remove
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Item removed from cart"));
});

export const getCart = asyncHandler(async (req, res) => {
  /**
   * Mental Flow:
   * 1. Get logged-in user ID from JWT middleware (req.user)
   * 2. Find active cart for user and populate food details
   * 3. If cart is empty or missing items, return empty array
   * 4. Filter out any invalid items (missing food or price)
   * 5. Calculate total cart amount
   * 6. Return valid items and total amount in response
   */

  // 1. Get logged-in user ID
  const userId = req.user._id;

  // 2. Find user's active cart and populate food info
  const cart = await Cart.findOne({ user: userId, isActive: true }).populate(
    "item.food",
    "name price image",
  );

  // 3. If cart is empty or missing items
  if (!cart || !cart.item || cart.item.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
  }

  // 4. Filter out invalid items
  const validItems = cart.item.filter(
    (cartItem) => cartItem.food && typeof cartItem.price !== "undefined",
  );

  // 5. Calculate total amount
  const totalAmount = validItems.reduce(
    (sum, cartItem) => sum + cartItem.price * (cartItem.quantity || 1),
    0,
  );

  // 6. Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: validItems, totalAmount },
        "Cart fetched successfully",
      ),
    );
});
export const updateCartItem = asyncHandler(async (req, res) => {
  /**
   * Mental Flow:
   * 1. Get authenticated user ID from req.user
   * 2. Get foodId from req.params
   * 3. Get new quantity (and optional price) from req.body
   * 4. Validate foodId and quantity
   * 5. Find user's active cart
   * 6. If no cart → return empty/error
   * 7. Find the item in cart
   * 8. Update quantity (and price if provided)
   * 9. Save cart
   * 10. Calculate totalAmount
   * 11. Return updated cart
   */
  // Get authenticated user ID from req.user

  const userId = req.user._id;

  const { foodId } = req.params;

  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    throw new ApiError(400, "Invalid Foodid");
  }
  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quanity must be atleast 1");
  }

  const cart = await Cart.findOne({ user: userId, isActive: true });
  if (!cart) {
    throw new ApiError(404, "cart not found!!");
  }
  // Find the item in cart

  const itemIndex = cart.item.findIndex(
    (item) => item.food.toString() === foodId,
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Fooditem not found in the cart");
  }

  // Update quantity
  cart.item[itemIndex].quantity = quantity;

  await cart.save();

  // Calculate totalAmount
  const totalAmount = cart.item.reduce(
    (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
    0,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: cart.item, totalAmount },
        "cart updated successfully",
      ),
    );
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  await Cart.findOneAndUpdate(
    { user: userId, isActive: true },
    { isActive: false },
  );

  res.status(200).json({ success: true, message: "Cart cleared" });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  /**
   * MENTAL FLOW:
   * 1. Extract coupon code and cart total from request body
   * 2. Validate required input
   * 3. Fetch coupon from database
   * 4. Validate coupon status (exists, active, not expired)
   * 5. Validate minimum cart value
   * 6. Calculate discount amount
   * 7. Store applied coupon for the user
   * 8. Return updated cart pricing
   */

  const { code, cartTotal } = req.body;
  if (!code || cartTotal === undefined) {
    //we  cannot do !cartTotal because cartTotal = 0 is vallid
    throw new ApiError(400, "code and cartTotal are required!!!");
  }
  // Fetch coupon from database

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  // Validate coupon existence and active status
  if (!coupon || !coupon.isActive) {
    throw new ApiError(404, "Invalid or inactive coupon");
  }
  // Check coupon expiration
  if (coupon.expiresAt < new Date()) {
    throw new ApiError(400, "Coupon is Expired");
  }
  //  Validate minimum cart value condition
  if (cartTotal < coupon.minCartValue) {
    throw new ApiError(
      400,
      `Min Cart Value of ${coupon.minCartValue} required `,
    );
  }
  let discount = 0;
  if (coupon.discountType === "PERCENT") {
    // Percentage-based discount
    discount = (cartTotal * coupon.discountValue) / 100;
  } else {
    // Flat amount discount
    discount = coupon.discountValue;
  }
  // Ensure final amount never goes below zero
  const finalAmount = Math.max(cartTotal - discount, 0);

  // Store applied coupon on user
  await User.findByIdAndUpdate(req.user._id, {
    appliedCoupon: coupon.code,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cartTotal, discount, finalAmount, coupon: coupon.code },
        "Coupon applied successfully!!",
      ),
    );
});
export const removeCoupon = asyncHandler(async (req, res) => {
  /**
   * MENTAL FLOW (INDUSTRY STANDARD):
   * 1. Get authenticated user from req (set by verifyJWT)
   * 2. Fetch user from database
   * 3. Check if a coupon is applied
   * 4. Remove applied coupon
   * 5. Save user
   * 6. Return success response
   */

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }
  // Fetch user from database
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if a coupon is applied

  if (!user.appliedCoupon) {
    throw new ApiError(400, "No coupon is  applied to remove ");
  }
  // Remove applied coupon
  user.appliedCoupon = null;
  //save user
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon removed successfully"));
});
