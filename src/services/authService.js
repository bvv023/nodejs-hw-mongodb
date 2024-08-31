// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';
import { SMTP, APP_DOMAIN } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';
import fs from 'fs';
import path from 'path';

console.log(`SMTP Configuration: Host - ${SMTP.SMTP_HOST}, Port - ${SMTP.SMTP_PORT}`);

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return newUser.toJSON();
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

  return { accessToken, refreshToken, sessionId: session._id };
};

const refreshSession = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const session = await Session.findOne({ refreshToken });

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

  return { accessToken: newAccessToken, newRefreshToken, sessionId: session._id };
};

const logoutUser = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session) {
    throw createError(404, 'Session not found');
  }
};

const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

  const templatePath = path.join(process.cwd(), 'src', 'templates', 'reset-password-email.html');
  let emailHtml = fs.readFileSync(templatePath, 'utf8');

  emailHtml = emailHtml.replace('{{name}}', user.name);
  emailHtml = emailHtml.replace('{{link}}', resetLink);

  const emailOptions = {
    from: SMTP.SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    html: emailHtml,
  };

  try {
    await sendEmail(emailOptions);
    console.log('Reset email sent successfully to:', email);
  } catch (error) {
    console.error('Email sending error details:', error);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });
    console.log('Password reset successfully for user:', user.email);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError(401, 'Token is expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError(401, 'Token is invalid');
    } else {
      throw createError(500, 'An error occurred while resetting the password');
    }
  }
};

export { registerUser, loginUser, refreshSession, logoutUser, sendResetEmailService, resetPasswordService };


