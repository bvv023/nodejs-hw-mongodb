// src/services/contacts.js
import Contact from '../models/contact.js';

const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filterOptions }) => {
  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments(filterOptions);

  const contacts = await Contact.find(filterOptions)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);

  return {
    contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasNextPage: page * perPage < totalItems,
    hasPreviousPage: page > 1,
  };
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const addContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

const updateContactById = async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
  });
  return updatedContact;
};

const deleteContactById = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};

export {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
};
