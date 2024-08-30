// src/utils/token.js
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError(401, 'Token is expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError(401, 'Token is invalid');
    } else {
      throw createError(500, 'An error occurred while verifying the token');
    }
  }
};
