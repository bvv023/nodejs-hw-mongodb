// src/utils/saveFileToCloudinary.js
import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUD_NAME'),
  api_key: env('API_KEY'),
  api_secret: env('API_SECRET'),
});

export const saveFileToCloudinary = async (file) => {
  console.log('Uploading file to Cloudinary:', file.path);
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path); // Видаляємо тимчасовий файл після завантаження
  console.log('File uploaded to Cloudinary:', response.secure_url);
  return response.secure_url;
};
