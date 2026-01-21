import { Router } from "express";
import { addToCart,applyCoupon,clearCart,getCart,removeCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()

router.route('/').get(verifyJWT,getCart);
router.route('/').delete(verifyJWT,clearCart)
router.route('/add').post(verifyJWT,addToCart);
router.route('/remove/:foodId').delete(verifyJWT,removeCart);
router.route('/coupon/apply').post(verifyJWT,applyCoupon);
router.route('/coupon/remove').delete(verifyJWT,removeCart)
export default router