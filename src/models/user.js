// src/models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject._id;
  delete userObject.__v;
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
