// src/db/models/contacts.js
import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: 'user@gmail.com',
    },
    isFavourite: {
      type: Boolean,
      default: false,
      set: (value) => value === '' ? undefined : value, // Ігнорувати порожні значення
    },
    contactType: {
      type: String,
      enum: ['home', 'personal', 'work'],
      required: true,
      default: 'home',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const ContactsCollection = model('contacts', contactsSchema);
