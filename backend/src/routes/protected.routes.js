import { Router } from "express";
import jwt from 'jsonwebtoken';  
import User from "../models/User.model.js";
const router = Router();
router.get('/auth/verify', async(req, res) => {
    const token = req.cookies.token;
    //console.log('Cookies and Token:', req.cookies.token);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const populatedUser = await User.findById(user.userId).select('-password -createdAt -updatedAt -history -favouriteBooks');
      res.json({ authenticated: true, user, populatedUser });
    } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
    }
});
export default router;