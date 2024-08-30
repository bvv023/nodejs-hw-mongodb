// src/utils/getPhotoURL.js
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import env from './env.js';

const getPhotoURL = async (file) => {
  if (!file) return '';

  if (env('CLOUDINARY_ENABLED') === 'true') {
    return await saveFileToCloudinary(file);
  }

  throw new Error('Cloudinary is not enabled. Please enable it in the .env file.');
};

export default getPhotoURL;
