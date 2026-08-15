import { User } from "../models/user.model.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";


export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const {
    label,
    street,
    city,
    state,
    zip,
    country,
    isDefault,
  } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!street || !city || !zip || !country) {
    throw new ApiError(
      400,
      "Street, city, zip and country are required",
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If this address should be default,
  // unset the existing default address first.
  if (isDefault) {
    user.address.forEach((item) => {
      item.isDefault = false;
    });
  }

  user.address.push({
    label,
    street,
    city,
    state,
    zip,
    country,
    isDefault: Boolean(isDefault),
  });

  await user.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        addresses: user.address,
      },
      "Address added successfully",
    ),
  );
});


export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId).select("address");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: user.address,
        totalAddresses: user.address.length,
      },
      user.address.length
        ? "Addresses retrieved successfully"
        : "No addresses found",
    ),
  );
});


export const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.params;

  const {
    label,
    street,
    city,
    state,
    zip,
    country,
  } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.address.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (label !== undefined) {
    address.label = label;
  }

  if (street !== undefined) {
    address.street = street;
  }

  if (city !== undefined) {
    address.city = city;
  }

  if (state !== undefined) {
    address.state = state;
  }

  if (zip !== undefined) {
    address.zip = zip;
  }

  if (country !== undefined) {
    address.country = country;
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: user.address,
      },
      "Address updated successfully",
    ),
  );
});



export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.address.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  // Optional:
  // if the deleted address was default,
  // make the first remaining address default.
  if (
    wasDefault &&
    user.address.length > 0
  ) {
    user.address[0].isDefault = true;
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: user.address,
      },
      "Address deleted successfully",
    ),
  );
});


export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const selectedAddress = user.address.id(addressId);

  if (!selectedAddress) {
    throw new ApiError(404, "Address not found");
  }

  user.address.forEach((address) => {
    address.isDefault =
      address._id.toString() === addressId;
  });

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: user.address,
      },
      "Default address updated successfully",
    ),
  );
});
