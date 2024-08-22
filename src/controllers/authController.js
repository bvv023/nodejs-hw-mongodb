// src/controllers/authController.js
import createError from 'http-errors';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/authService.js';

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
    next(createError(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUser(req.body);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
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
    console.log('Refresh endpoint hit');

    console.log('Cookies:', req.cookies);

    if (!req.cookies) {
      throw createError(403, 'No cookies found');
    }

    const refreshToken = req.cookies.refreshToken;
    console.log('Received refreshToken:', refreshToken);

    if (!refreshToken) {
      throw createError(403, 'Refresh token not found');
    }

    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
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
