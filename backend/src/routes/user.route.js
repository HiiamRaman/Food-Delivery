import {Router } from 'express';
import {loginUser,registerUser,refreshAccessToken,getcurrentAdmin,getAllUsers} from '../controllers/auth.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { verifyResetOtp,verifySignupOtp,sendResetPasswordOtp,changePassword,resetPassword ,resendSignupOtp} from '../controllers/otp.controller.js';
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.get('/all',verifyJWT,isAdmin,getAllUsers)
router.post('/refresh-token',refreshAccessToken)
router.get("/admin/me",verifyJWT,isAdmin,getcurrentAdmin)



router.post("/verify-signup-otp",verifySignupOtp)

router.post("/reset-signup-otp",sendResetPasswordOtp);
router.post("/verify-reset-otp",verifyResetOtp);
router.post("/change-password",verifyJWT,changePassword);
router.post("/reset-password",resetPassword);

router.post('/resend-otp',resendSignupOtp)

export default router;
