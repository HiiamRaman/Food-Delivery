import express from "express";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/middleware.error.js";
import cors from "cors";
export const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// import the routes

import healthCheckrouter from "./src/routes/healthCheck.routes.js";
import addFoodRouter from "./src/routes/food.routes.js";

app.use("/api/v1/healthcheck", healthCheckrouter);
app.use("/api/v1/add-food", addFoodRouter);

//Global Error handler and 404 handler

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);
