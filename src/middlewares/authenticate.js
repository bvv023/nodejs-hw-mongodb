// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw createError(401, 'Invalid token');
      }
      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      throw createError(401, 'Access token expired or invalid');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

export default authenticate;
