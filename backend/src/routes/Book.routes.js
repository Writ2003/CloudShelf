import { Router } from "express";
import { getPopularBook, getRecommendation, incrementReadership, getBooks, getCategories, getBookInfo, addToFavourite, getBookContent, uploadBookContent, addNewBook, removeBook } from "../controllers/Book.controller.js";
import upload  from '../middlewares/multer.middleware.js'
import verifyToken from "../middlewares/verifyJWT.js";
import verifyAdminToken from '../middlewares/verifyAdminJWT.js';
const router = Router();

router.post('/addNewBook',verifyToken,upload.single("image"),addNewBook);
router.get('/popular', getPopularBook);
router.post('/read/:bookId',verifyToken, incrementReadership);
router.get('/read/getContent/:bookId',verifyToken,getBookContent);
router.get('/recommendation', verifyToken, getRecommendation);
router.get('/getBooks', getBooks);
router.get('/categories', getCategories);
//router.get('/categories/:genre',getGenre);
router.get('/getBook/:bookId',verifyToken,getBookInfo);
router.post('/addToFavourite/:bookId',verifyToken,addToFavourite);
router.post('/upload/:bookId',upload.single('pdf'),uploadBookContent);
router.delete('/delete/:bookId',verifyAdminToken, removeBook);
export default router;