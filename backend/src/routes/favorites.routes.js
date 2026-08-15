import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addFavorite } from "../controllers/auth.controller.js";
import { removeFavorite } from "../controllers/auth.controller.js";
import { getFavorites } from "../controllers/auth.controller.js";
import express from 'express'
const router = express.Router()
router.post("/:foodId", verifyJWT, addFavorite);

router.get("/", verifyJWT, getFavorites);

router.delete("/remove/:foodId", verifyJWT, removeFavorite);

export default router;
