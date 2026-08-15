import express from "express";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import  {isAdmin} from '../middleware/admin.middleware.js'
import { getAddresses,addAddress,updateAddress,deleteAddress,setDefaultAddress } from "../controllers/address.controller.js";
const router = express.Router();

router.get("/addresses", verifyJWT, getAddresses);

router.post("/addresses", verifyJWT, addAddress);

router.patch("/addresses/:addressId", verifyJWT, updateAddress);

router.delete("/addresses/:addressId", verifyJWT, deleteAddress);

router.patch("/addresses/:addressId/default", verifyJWT, setDefaultAddress);

export default router;
