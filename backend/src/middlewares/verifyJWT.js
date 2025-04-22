import jwt from 'jsonwebtoken';
import User from '../models/User.model.js'; 

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // OPTIONAL: Fetch full user info from DB
    const user = await User.findById(decoded.id).select('-password'); // exclude password

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // attach to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
