import { Router } from "express";
import jwt from 'jsonwebtoken';  
const router = Router();
router.get('/auth/verify', (req, res) => {
    const token = req.cookies.token;
    //console.log('Cookies and Token:', req.cookies.token);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ authenticated: true, user });
    } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
    }
});
export default router;