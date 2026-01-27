// import express from "express";
// import {
//   notFoundHandler,
//   globalErrorHandler,
// } from "./src/middleware/middleware.error.js";
// import cors from "cors";
// export const app = express();

// import stripeRouter from './src/routes/stripe.routes.js'

// app.use("/api/v1/stripe",stripeRouter);



// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));

// //cors configuration
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Authorization", "Content-Type"],
//   }),
// );

// // import the routes

// import healthCheckrouter from "./src/routes/healthCheck.routes.js";
// import addFoodRouter from "./src/routes/food.routes.js";
// import foodListRouter from "./src/routes/food.routes.js";
// import removeFoodRouter from "./src/routes/food.routes.js";
// import authRouter from "./src/routes/user.route.js";
// import cartRouter from "./src/routes/cart.routes.js";
// import orderRouter from './src/routes/order.routes.js';


// app.use("/api/v1/healthcheck", healthCheckrouter);
// app.use("/api/v1/add-food", addFoodRouter);
// app.use("/api/v1/allfoods", foodListRouter);
// app.use("/api/v1/remove-food", removeFoodRouter);
// app.use("/api/v1/user", authRouter);

// app.use("/api/v1/getCart", cartRouter);
// app.use("/api/v1/deleteCart", cartRouter);
// app.use("/api/v1/cart",cartRouter);

// // Stripe webhook must be registered BEFORE express.json()


// app.use("/api/v1/order",orderRouter);

// //Global Error handler and 404 handler

// // 404 handler
// app.use(notFoundHandler);

// // Global error handler (must be last)
// app.use(globalErrorHandler);




























import express from "express";
import cors from "cors";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/middleware.error.js";

// Import routes first
import stripeRouter from './src/routes/stripe.routes.js';
import healthCheckrouter from "./src/routes/healthCheck.routes.js";
import addFoodRouter from "./src/routes/food.routes.js";
import foodListRouter from "./src/routes/food.routes.js";
import removeFoodRouter from "./src/routes/food.routes.js";
import authRouter from "./src/routes/user.route.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from './src/routes/order.routes.js';

export const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// ⚠️ Stripe webhook route must be registered BEFORE express.json()
app.use("/api/v1/stripe/webhook", stripeRouter); // webhook route

// Body parsers for other routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Other routes
app.use("/api/v1/healthcheck", healthCheckrouter);
app.use("/api/v1/add-food", addFoodRouter);
app.use("/api/v1/allfoods", foodListRouter);
app.use("/api/v1/remove-food", removeFoodRouter);
app.use("/api/v1/user", authRouter);
app.use("/api/v1/getCart", cartRouter);
app.use("/api/v1/deleteCart", cartRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

// Global error handler and 404
app.use(notFoundHandler);
app.use(globalErrorHandler);

