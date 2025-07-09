import { Router } from 'express';
import verifyToken from '../middlewares/verifyJWT.js';
import { toggleLikeState } from '../controllers/LikeComments.controller.js';

const router = Router();

router.patch('/toggleLike/:commentId', verifyToken, toggleLikeState);

export default router;