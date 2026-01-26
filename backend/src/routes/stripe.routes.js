import { Router } from "express";
import express from "express";
import { stripeWebHook } from "../controllers/stripe.controller.js";
const router = Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebHook);

export default router;
