import { Router } from 'express';
import verifyToken from '../middlewares/verifyJWT.js';
import { toggleLikeState } from '../controllers/LikeReplies.controller.js';
const router = Router();

router.patch('/toggleLike/:replyId', verifyToken, toggleLikeState)

export default router;