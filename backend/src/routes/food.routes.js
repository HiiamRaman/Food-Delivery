import {Router} from 'express';
import { addFood ,listFood,removeFoodItem} from '../controllers/food.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router()
router.route('/add').post(upload.single("image"),addFood);
router.route('/').get(listFood);
router.route('/:id').delete(removeFoodItem)

export default router;