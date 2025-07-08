import {Router} from 'express';
import { addReview, fetchReview, updateReview, fetchAllReviews, deleteReview } from '../controllers/Review.controller.js';
import verifyToken from '../middlewares/verifyJWT.js';

const router = Router();

router.post('/addReview/:bookId', verifyToken, addReview)
router.get('/fetchReview/:bookId', verifyToken, fetchReview);
router.patch('/updateReview/:bookId', verifyToken, updateReview);
router.delete('/deleteReview/:bookId', verifyToken, deleteReview);
router.get('/allReviews/:bookId', fetchAllReviews);

export default router;