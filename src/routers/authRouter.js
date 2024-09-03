// src/routers/authRouter.js
import express from 'express';
import {
  registerSchema,
  loginSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/authValidation.js';
import validateBody from '../middlewares/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
  getGoogleOAuthUrlController,
  loginOrSignupWithGoogle,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', authenticate, refresh);
router.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

// Google OAuth
router.get('/google-oauth-url', getGoogleOAuthUrlController);
router.post('/login-google', loginOrSignupWithGoogle);

export default router;
