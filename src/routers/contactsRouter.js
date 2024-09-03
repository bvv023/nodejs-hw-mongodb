// src/routers/contactsRouter.js
import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactValidation.js';
import contactsController from '../controllers/contactsController.js';

const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = contactsController;

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(getContacts)
  .post(validateBody(createContactSchema), createContact);

router
  .route('/:contactId')
  .get(getContact)
  .patch(validateBody(updateContactSchema), updateContact)
  .delete(deleteContact);

export default router;
