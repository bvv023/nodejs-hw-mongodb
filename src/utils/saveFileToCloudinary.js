// src/utils/saveFileToCloudinary.js
import cloudinary from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
