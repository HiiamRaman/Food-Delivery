import {Router } from 'express';
import {loginUser,registerUser,refreshAccessToken,getcurrentAdmin} from '../controllers/auth.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { verifyResetOtp,verifySignupOtp,sendResetPasswordOtp } from '../controllers/otp.controller.js';
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.post('/refresh-token',refreshAccessToken)
router.get("/admin/me",verifyJWT,isAdmin,getcurrentAdmin)



router.post("/verify-signup-otp",verifySignupOtp)

router.post("/reset-signup-otp",sendResetPasswordOtp);
router.post("/verify-reset-otp",verifyResetOtp);

export default router;