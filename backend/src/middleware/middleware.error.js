



import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";


export const notFoundHandler = (req, res, next) => {

  // Create error and forward it
  const error = new ApiError(404, "Route not found");

  next(error); // ✅ IMPORTANT
};


// Global error handler
export const globalErrorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      err.data || null,
      err.message || "Internal Server Error",
      err.errors || []
    )
  );
};
