import express from "express";
import { getDeliveryRoute } from "../controllers/delivery.controller.js";

const router = express.Router();

router.post("/route", getDeliveryRoute);

export default router;