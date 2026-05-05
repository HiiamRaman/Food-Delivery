import {Router} from 'express';
import { addFood ,listFood,removeFoodItem} from '../controllers/food.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {isAdmin} from '../middleware/admin.middleware.js'
const router = Router()
router.route('/add').post(verifyJWT,isAdmin, upload.single("image"),addFood);
router.route('/').get(listFood);
router.route('/:id').delete(verifyJWT,  isAdmin, removeFoodItem)

export default router;