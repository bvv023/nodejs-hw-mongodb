// src/controllers/contactsController.js
import createError from 'http-errors';
import { getAllContacts, getContactById, addContact, updateContactById, deleteContactById } from '../services/contacts.js';

const getContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const options = {
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filterOptions: {}
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
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await updateContactById(req.params.contactId, req.body);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const result = await deleteContactById(req.params.contactId);
    if (!result) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getContacts, getContact, createContact, updateContact, deleteContact };
