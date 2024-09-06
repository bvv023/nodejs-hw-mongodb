// src/routes/index.js
import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

router.get('/favicon.ico', (req, res) => res.status(204));

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
