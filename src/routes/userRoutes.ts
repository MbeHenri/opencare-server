import express from "express";
import auth from "../middleware/auth";
import { getUser } from "../controllers/authController";

const router = express.Router();

router.get("/user", auth, getUser);

export default router;