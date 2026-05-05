import express from "express";
import { createOrder,getAllOrders} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { orderWorkflowController,adminDispatchOrder } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/create", verifyJWT, createOrder);
router.get("/allOrders",verifyJWT,isAdmin, getAllOrders)
router.post("/:orderId/workflow", verifyJWT,isAdmin, orderWorkflowController);
router.post("/:orderId/admin-dispatch",verifyJWT,isAdmin, adminDispatchOrder)
export default router;
