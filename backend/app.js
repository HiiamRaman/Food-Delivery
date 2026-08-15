import express from "express";
import cors from "cors";
import { notFoundHandler, globalErrorHandler } from "./src/middleware/middleware.error.js";


// Routes
import healthCheckrouter from "./src/routes/healthCheck.routes.js";
import addFoodRouter from "./src/routes/food.routes.js";
import foodListRouter from "./src/routes/food.routes.js";
import removeFoodRouter from "./src/routes/food.routes.js";
import authRouter from "./src/routes/user.route.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from './src/routes/order.routes.js';
import stripeRouter from './src/routes/stripe.routes.js';
import successRouter from './src/routes/payment.routes.js';
import deliveryRouter from './src/routes/delivery.routes.js'
import dashboardRouter from './src/routes/dashboard.routes.js'
import favoritesRouter from './src/routes/favorites.routes.js'
// import EmailRouter from './src/routes/email.routes.js'
import cookieParser from "cookie-parser";
export const app = express();
app.use(cookieParser())
// ----------------- STRIPE WEBHOOK -----------------
// Must be raw parser for Stripe signature verification
app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }));

// ----------------- BODY PARSERS -----------------
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ----------------- CORS -----------------
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // frontend URLs
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));



// ----------------- ROUTES -----------------
app.use("/api/v1/healthcheck", healthCheckrouter);

// Food routes
app.use("/api/v1/add-food", addFoodRouter);
app.use("/api/v1/allfoods", foodListRouter);
app.use("/api/v1/remove-food", removeFoodRouter);

// User auth routes
app.use("/api/v1/user", authRouter);
//dashboard
app.use("/api/v1/dashboard",dashboardRouter);

// Cart routes
app.use("/api/v1/cart", cartRouter);         // get, add, delete, etc.
app.use("/api/v1/getCart", cartRouter);      // optional duplicate if needed
app.use("/api/v1/deleteCart", cartRouter);


// Order routes
app.use("/api/v1/order", orderRouter);

// Stripe routes
app.use("/api/v1/stripe", stripeRouter);

// paymentRoutes
app.use("/api/v1/payment",successRouter);

//deliveryRoute
app.use('/api/v1/delivery',deliveryRouter);
//test emailRoute
// app.use('/api/v1/email',EmailRouter);

app.use('/api/v1/favorites',favoritesRouter)


// ----------------- ERROR HANDLERS -----------------
app.use(notFoundHandler);
app.use(globalErrorHandler);
