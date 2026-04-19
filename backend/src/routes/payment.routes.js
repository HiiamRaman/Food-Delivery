import  express  from "express";
import { handlePaymentSuccess } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/success", handlePaymentSuccess);
export default router;
