import express from "express";
import { sendOtpEmail } from "../controllers/sendotpEmail.controller.js";
const router  = express.Router();

router.get("/test",sendOtpEmail);

export default router;
