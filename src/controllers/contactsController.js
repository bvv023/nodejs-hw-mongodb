// src/controllers/contactsController.js
import createError from 'http-errors';
import Contact from '../models/contact.js';
import { getAllContacts, getContactById, addContact } from '../services/contacts.js';

const getContacts = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
      throw createError(404, 'Contact not found or unauthorized access');
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
    const newContact = await addContact({ ...req.body, userId: req.user._id });
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
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      throw createError(404, 'Contact not found or unauthorized access');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.contactId, userId: req.user._id });

    if (!contact) {
      throw createError(404, 'Contact not found or unauthorized access');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getContacts, getContact, createContact, updateContact, deleteContact };
