import express from "express";
import {getBase, getHealth} from "../controllers/health.js"

const router = express.Router();

router.get("", getBase);
router.get("/healthz", getHealth);

export default router;