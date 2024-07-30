// src/routers/contactsRouter.js
import express from 'express';
import { getContacts, getContact } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('GET /contacts');
  getContacts(req, res);
});

router.get('/:contactId', (req, res) => {
  console.log(`GET /contacts/${req.params.contactId}`);
  getContact(req, res);
});

export default router;
