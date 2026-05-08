import {Router } from 'express';
import {loginUser,registerUser,refreshAccessToken} from '../controllers/auth.controller.js'
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.post('/refresh-token',refreshAccessToken)


export default router;