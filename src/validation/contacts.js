// src/validation/contactValidation.js
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.empty': `"name" is not allowed to be empty`,
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.empty': `"phoneNumber" is not allowed to be empty`,
  }),
  email: Joi.string().email().optional().allow(null, '').messages({
    'string.email': `"email" must be a valid email`,
    'string.empty': `"email" is not allowed to be empty`,
  }),
  isFavourite: Joi.boolean().optional().allow(null, '').messages({
    'boolean.base': `"isFavourite" must be a boolean`,
  }),
  contactType: Joi.string().valid('home', 'personal', 'work').required().messages({
    'any.only': `"contactType" must be one of [home, personal, work]`,
    'string.empty': `"contactType" is not allowed to be empty`,
  }),
  photo: Joi.any().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().allow(null, ''),
  phoneNumber: Joi.string().min(3).max(20).optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, '').messages({
    'string.email': `"email" must be a valid email`,
    'string.empty': `"email" is not allowed to be empty`,
  }),
  isFavourite: Joi.boolean().optional().allow(null, '').messages({
    'boolean.base': `"isFavourite" must be a boolean`,
  }),
  contactType: Joi.string().valid('home', 'personal', 'work').optional().allow(null, '').messages({
    'any.only': `"contactType" must be one of [home, personal, work]`,
    'string.empty': `"contactType" is not allowed to be empty`,
  }),
  photo: Joi.any().optional(),
}).min(1);
