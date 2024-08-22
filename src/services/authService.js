// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  console.log("New user registered:", userWithoutPassword);

  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Session created:", session);

  return { accessToken, refreshToken };
};

const refreshSession = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw createError(403, 'No refresh token provided');
    }

    console.log("Refresh token received:", refreshToken);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("Decoded token:", decoded);

    const session = await Session.findOne({ refreshToken });
    console.log("Session found:", session);

    if (!session || session.refreshTokenValidUntil < Date.now()) {
      throw createError(403, 'Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    session.refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    console.log("Session refreshed:", session);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("Refresh error:", error);
    throw createError(403, 'Invalid refresh token');
  }
};

const logoutUser = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session) {
    throw createError(404, 'Session not found');
  }

  console.log("Session deleted:", session);
};

export { registerUser, loginUser, refreshSession, logoutUser };
