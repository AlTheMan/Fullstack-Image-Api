import express from "express";
import { getAllImages, getUserImages, newImage } from "../controllers/image.js";

const router = express.Router();



router.post("/image", newImage);
router.get("/image", getUserImages);
//router.get("/image/:userId", getUserImages);

export default router;
