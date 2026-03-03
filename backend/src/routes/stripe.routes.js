// src/routes/stripe.routes.js
import express from "express";
import { createStripeSession } from "../controllers/stripe.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { stripeWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Protected route: user must be logged in
router.post("/create-session", verifyJWT, createStripeSession);
// Stripe webhook (raw body!)
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
export default router;
