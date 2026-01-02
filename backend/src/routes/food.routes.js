import {Router} from 'express';
import { addFood ,listFood} from '../controllers/food.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router()
router.route('/add').post(upload.single("image"),addFood);
router.route('/').get(listFood)

export default router;