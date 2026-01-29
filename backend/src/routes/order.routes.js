import {Router} from "express";
import { createOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
//user creates order so we need login

const router = Router();
router.route("/create").post(verifyJWT,createOrder)

export default router