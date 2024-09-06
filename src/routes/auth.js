// src/routes/auth.js
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  loginWithGoogleOAuthSchema, // Схема валідації Google OAuth
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const parseJSON = express.json();

router.post(
  '/register',
  parseJSON,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  parseJSON,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', parseJSON, ctrlWrapper(logoutUserController));

router.post('/refresh', parseJSON, ctrlWrapper(refreshUserSessionController));

router.post(
  '/send-reset-email',
  parseJSON,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  parseJSON,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

// Маршрут для отримання URL Google OAuth
router.get('/google-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

// Маршрут для обробки Google OAuth
router.post(
  '/confirm-google-auth',
  parseJSON,
  validateBody(loginWithGoogleOAuthSchema), // Використовується схема валідації
  ctrlWrapper(loginWithGoogleController),
);

export default router;
