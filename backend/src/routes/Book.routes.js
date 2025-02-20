import { Router } from "express";
import { getPopularBook, getRecommendation, incrementReadership } from "../controllers/Book.controller.js";

const router = Router();

router.get('/popular', getPopularBook)
router.post('read/:bookId', incrementReadership)
router.get('recommend/:userId', getRecommendation)

export default router;