import express from "express";
import { createOrder,getAllOrders} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { orderWorkflowController } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/create", verifyJWT, createOrder);
router.get("/allOrders",getAllOrders)
router.post("/:orderId/workflow", orderWorkflowController);

export default router;
