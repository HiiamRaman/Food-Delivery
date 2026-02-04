// import {Router} from "express";
// import { createOrder } from "../controllers/order.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";
// //user creates order so we need login

// const router = Router();
// router.route("/create").post(verifyJWT,createOrder)

// export default router




import express from "express";
import { createOrder } from "../controllers/order.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { getOrder } from "../controllers/getOrder.controller.js";

const router = express.Router();

// Create a new order
router.post("/create", verifyJWT, createOrder);

// Get single order by ID
router.get("/:id", verifyJWT, getOrder); // <--- use getOrder, not createOrder

export default router;







