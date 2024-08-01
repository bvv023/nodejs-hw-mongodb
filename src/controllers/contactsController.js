// src/controllers/contactsController.js
import { getAllContacts, getContactById } from '../services/contacts.js';

const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error(`Error fetching contact with id ${req.params.contactId}:`, error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export { getContacts, getContact };


