import { Router } from "express";
import { searchBook } from "../controllers/Search.controller.js";

const router = Router();

router.get('/searchBooks',searchBook)

export default router;