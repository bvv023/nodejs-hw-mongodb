// src/controllers/authController.js
import createError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmailService,
  resetPasswordService,
  loginOrSignupWithGoogle as loginOrSignupWithGoogleService,
} from '../services/authService.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Email in use') {
      next(createError(409, error.message));
    } else {
      next(createError(500, error.message));
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, sessionId } = await loginUser(req.body);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('sessionId', sessionId, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(createError(401, 'Invalid email or password'));
  }
};

export const refresh = async (req, res, next) => {
  try {
    if (!req.cookies) {
      throw createError(403, 'No cookies found');
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(403, 'Refresh token not found');
    }

    const { accessToken, newRefreshToken, sessionId } = await refreshSession(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.cookie('sessionId', sessionId, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    next(createError(403, 'Invalid refresh token'));
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.cookies.refreshToken);
    res.status(204).send();
  } catch (error) {
    console.error('Logout error:', error);
    next(createError(500, error.message));
  }
};

export const sendResetEmail = async (req, res, next) => {
  try {
    await sendResetEmailService(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService(req.body.token, req.body.password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginOrSignupWithGoogle = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await loginOrSignupWithGoogleService(code);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in or signed up with Google!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

