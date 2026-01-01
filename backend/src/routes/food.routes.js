import {Router} from 'express';
import { addFood } from '../controllers/food.controller.js';


const router = Router()
router.route('/add').post(addFood);


export default router;