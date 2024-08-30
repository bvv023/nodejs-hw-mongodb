// src/controllers/contactsController.js
import createError from 'http-errors';
import Contact from '../models/contact.js';
import { getAllContacts, getContactById, addContact, updateContactById, deleteContactById } from '../services/contacts.js';
import getPhotoURL from '../utils/getPhotoURL.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const getContacts = async (req, res, next) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

  const options = {
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    filterOptions: { userId: req.user._id }
  };

  if (type) {
    options.filterOptions.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    options.filterOptions.isFavourite = isFavourite === 'true';
  }

  const result = await getAllContacts(options);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

const getContact = async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact || contact.userId.toString() !== req.user._id.toString()) {
    throw createError(404, 'Contact not found or unauthorized access');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

const createContact = async (req, res, next) => {
  const photoUrl = await getPhotoURL(req.file);
  const newContact = await addContact({ ...req.body, userId: req.user._id, photo: photoUrl });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

const updateContact = async (req, res, next) => {
  const photoUrl = await getPhotoURL(req.file);
  const updatedData = { ...req.body };
  if (photoUrl) {
    updatedData.photo = photoUrl;
  }

  const updatedContact = await updateContactById(req.params.contactId, updatedData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found or unauthorized access');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated the contact!',
    data: updatedContact,
  });
};

const deleteContact = async (req, res, next) => {
  const contact = await deleteContactById(req.params.contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found or unauthorized access');
  }

  res.status(204).send();
};

export default {
  getContacts: ctrlWrapper(getContacts),
  getContact: ctrlWrapper(getContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
