import {Router } from 'express';
import {loginUser,registerUser} from '../controllers/auth.controller.js'
const router = Router();

router.route('/').post(registerUser);
router.route('/').post(loginUser);



export default router;