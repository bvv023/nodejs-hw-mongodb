// src/routers/authRouter.js
import express from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPassword } from '../controllers/authController.js';
import validateBody from '../utils/validateBody.js';
import { registerSchema, loginSchema, resetEmailSchema, resetPasswordSchema } from '../validation/authValidation.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;
