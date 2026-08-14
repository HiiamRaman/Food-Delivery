import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
const router  = express.Router()
router.get('/',verifyJWT,isAdmin,getDashboardStats)


export default router
