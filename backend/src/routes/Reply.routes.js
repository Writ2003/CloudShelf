import { Router } from 'express';
import verifyToken from '../middlewares/verifyJWT.js';
import { addReply, fetchReplies, deleteReply, updateReply } from '../controllers/Reply.controller.js';

const router = Router();

router.post('/addReply/:reviewId', verifyToken, addReply);
router.get('/fetchReplies/:reviewId', fetchReplies);
router.delete('/deleteReply/:replyId', verifyToken, deleteReply);
router.put('/updateReply/:replyId', verifyToken, updateReply);


export default router;