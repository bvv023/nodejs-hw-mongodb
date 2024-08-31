// src/routers/contactsRouter.js
import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import contactsController from '../controllers/contactsController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', authenticate, contactsController.getContacts);
router.get('/:contactId', authenticate, contactsController.getContact);
router.post('/', authenticate, upload.single('photo'), contactsController.createContact);
router.put('/:contactId', authenticate, upload.single('photo'), contactsController.replaceContact);
router.patch('/:contactId', authenticate, upload.single('photo'), contactsController.updateContact);
router.delete('/:contactId', authenticate, contactsController.deleteContact);

export default router;
