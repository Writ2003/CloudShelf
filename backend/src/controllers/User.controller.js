import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password, userType });
    await user.save();

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password, userType } = req.body;

    const user = await User.findOne({ $or:[{email: usernameOrEmail}, {username:usernameOrEmail}] });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if(user.userType!==userType) return res.status(400).json({message: `No such ${userType} found!` });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });

    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JavaScript access
      maxAge: parseInt(process.env.JWT_TOKEN_EXPIRY)*24 * 60 * 60 * 1000, 
      secure: false,
      sameSite: 'lax' 
    });
   
    res.status(200).json({ success: true, message: 'Login successful', user: { username: user.username, email: user.email, userType:user.userType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutUser = (req,res) => {
  res.clearCookie('token'); 
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}