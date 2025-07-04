// routes/discussionMessageRoutes.js
import { Router } from 'express';
import { getMessagesByTopic } from '../controllers/Discussion.controller.js';
import { verifyToken } from '../middlewares/verifyJWT.js';

const router = Router();

router.get('/get/:topicId', verifyToken, getMessagesByTopic);

export default router;
