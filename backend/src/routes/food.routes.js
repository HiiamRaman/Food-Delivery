import {Router} from 'express';
import { addFood } from '../controllers/food.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router()
router.route('/add').post(upload.single("image"),addFood);


export default router;