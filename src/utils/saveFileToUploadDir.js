// src/utils/saveFileToUploadDir.js
import cloudinary from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import path from 'path';
import fs from 'fs/promises';

cloudinary.v2.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path);
  return result.secure_url;
};

export const saveFileToUploadDir = async (file) => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${Date.now()}_${file.originalname}`);
  
  await fs.rename(file.path, filePath);
  
  return filePath;
};
