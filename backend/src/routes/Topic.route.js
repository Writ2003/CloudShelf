import { Router } from 'express';
import verifyToken from '../middlewares/verifyJWT';
import { createTopic, getTopics, getTopicById } from '../controllers/Topic.controller.js';

const router = Router();

router.post('/createTopic', verifyToken, createTopic);
router.get('/getTopics', getTopics);
router.get('/getTopic/:topicId', getTopicById);

export default router;