import { Router } from "express";
import { addToCart,applyCoupon,clearCart,getCart,removeCart ,updateCartItem} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()

router.route('/').get(verifyJWT,getCart);

router.route('/add').post(verifyJWT,addToCart);

router.route('/remove/:foodId').delete(verifyJWT,removeCart);
router.route('/coupon/apply').post(verifyJWT,applyCoupon);
// router.route('/removeCoupon').delete(verifyJWT,removeCart)
router.route('/update/:foodId').post(verifyJWT,updateCartItem);

router.route('/clear').delete(verifyJWT,clearCart)
export default router