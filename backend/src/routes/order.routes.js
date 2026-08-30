import express from "express";
import {
  assignRider,
  createOrder,
  getAllOrders,
  cancelOrder,
  getAdminOrders,
  getAdminOrderById
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  orderWorkflowController,
  adminDispatchOrder,
} from "../controllers/order.controller.js";
import { getMyOrders } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/create", verifyJWT, createOrder);
router.get("/allOrders", verifyJWT, isAdmin, getAllOrders);
router.post("/:orderId/workflow", verifyJWT, isAdmin, orderWorkflowController);
router.post("/:orderId/admin-dispatch", verifyJWT, isAdmin, adminDispatchOrder);
router.patch("/:orderId/cancel", verifyJWT, isAdmin, cancelOrder);
router.patch("/assign-rider", verifyJWT, isAdmin, assignRider);
router.get("/my-orders", verifyJWT, getMyOrders);
router.get("/admin/all", verifyJWT, isAdmin, getAdminOrders);
router.get("/:orderId", verifyJWT, isAdmin, getAdminOrderById);
export default router;
