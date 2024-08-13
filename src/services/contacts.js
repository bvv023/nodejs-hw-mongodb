// src/services/contacts.js
import Contact from '../models/contact.js';

const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filterOptions }) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const totalItems = await Contact.countDocuments(filterOptions);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filterOptions)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

const addContact = async (data) => {
  return await Contact.create(data);
};

const updateContactById = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

const deleteContactById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

export { getAllContacts, getContactById, addContact, updateContactById, deleteContactById };
