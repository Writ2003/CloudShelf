import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/User.controller.js";

const router = Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

export default router;