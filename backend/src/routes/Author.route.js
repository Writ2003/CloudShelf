import { Router } from 'express';
import { addAuthor, getAuthor } from '../controllers/Author.controller.js'

const router = Router();

router.post('/addAuthor',addAuthor);
router.get('/getAuthor', getAuthor);

export default router;