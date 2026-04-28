import express from "express";
import { createOrder,getAllOrders,changeOrderStatus} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createOrder);
router.get("/allOrders",getAllOrders)
router.patch("/:orderId/status", changeOrderStatus);

export default router;
