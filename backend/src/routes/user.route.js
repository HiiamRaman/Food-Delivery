import {Router } from 'express';
import {loginUser,registerUser,refreshAccessToken,getcurrentAdmin} from '../controllers/auth.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.post('/refresh-token',refreshAccessToken)
router.get("/admin/me",verifyJWT,isAdmin,getcurrentAdmin)

export default router;