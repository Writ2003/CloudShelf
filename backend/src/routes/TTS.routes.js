import { Router } from 'express';
import { speakText }  from '../controllers/tts.controller.js'
const router = Router();

router.post('/convertToAudio', speakText);

export default router;