//src/utils/authUtils.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
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
