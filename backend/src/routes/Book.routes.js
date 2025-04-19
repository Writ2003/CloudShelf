import { Router } from "express";
import { getPopularBook, getRecommendation, incrementReadership, getBooks, getCategories, getBookInfo } from "../controllers/Book.controller.js";

const router = Router();

router.get('/popular', getPopularBook)
router.post('read/:bookId', incrementReadership)
router.get('recommend/:userId', getRecommendation)
router.get('/getBooks', getBooks);
router.get('/categories', getCategories);
//router.get('/categories/:genre',getGenre);
router.get('/getBook/:bookId',getBookInfo);
export default router;