// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    const userId = req.cookies.userId;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw createError(401, 'Invalid token');
      }

      req.user = user;
    } else if (refreshToken && userId) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(userId);

      if (!user || decoded.userId !== user.id) {
        throw createError(401, 'Invalid refresh token');
      }

      req.user = user;
    } else {
      throw createError(401, 'No token provided');
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

export default authenticate;
