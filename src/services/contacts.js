// src/services/contacts.js
import Contact from '../models/contact.js';

const getAllContacts = async () => {
  return await Contact.find();
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
