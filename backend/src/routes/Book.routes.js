import { Router } from "express";
import { getPopularBook, getRecommendation, incrementReadership, getBooks, getCategories, getBookInfo, addToFavourite } from "../controllers/Book.controller.js";
import verifyToken from "../middlewares/verifyJWT.js";
const router = Router();

router.get('/popular', getPopularBook)
router.post('/read/:bookId',verifyToken, incrementReadership)
router.get('/recommendation', verifyToken, getRecommendation)
router.get('/getBooks', getBooks);
router.get('/categories', getCategories);
//router.get('/categories/:genre',getGenre);
router.get('/getBook/:bookId',verifyToken,getBookInfo);
router.post('/addToFavourite/:bookId',verifyToken,addToFavourite);
export default router;