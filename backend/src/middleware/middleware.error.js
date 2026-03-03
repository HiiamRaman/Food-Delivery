// import { ApiResponse } from "../utils/apiResponse.js";

// export const globalErrorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res
//     .status(statusCode)
//     .json(
//       new ApiResponse(
//         statusCode,
//         err.data || null,
//         err.message || "Internal Server Error",
//         err.errors || []
//       )
//     );
// };

// // 404 handler
// export const notFoundHandler = (req, res, next) => {
//   res.status(404).json(new ApiResponse(404, null, "Route not found"));
// };









import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

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
