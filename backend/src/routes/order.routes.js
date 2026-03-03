import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createOrder);

export default router;
