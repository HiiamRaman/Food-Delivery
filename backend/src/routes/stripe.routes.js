// import { Router } from "express";
// import express from "express";
// import { stripeWebHook } from "../controllers/stripe.controller.js";
// const router = Router();

// router
//   .route("/")
//   .post(express.raw({ type: "application/json" }), stripeWebHook);

// export default router;








// src/routes/stripe.routes.js
import express from "express";
import { stripeWebHook } from "../controllers/stripe.controller.js";

const router = express.Router();

// Must use express.raw() for Stripe signature verification
router.post("/", express.raw({ type: "application/json" }), stripeWebHook);

export default router;
