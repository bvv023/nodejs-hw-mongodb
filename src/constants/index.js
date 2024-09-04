// src/constants/index.js
import env from '../utils/env.js';
import path from 'node:path';

export const SMTP = {
  SMTP_HOST: env('SMTP_HOST'),
  SMTP_PORT: env('SMTP_PORT'),
  SMTP_USER: env('SMTP_USER'),
  SMTP_PASSWORD: env('SMTP_PASSWORD'),
  SMTP_FROM: env('SMTP_FROM'),
};

export const APP_DOMAIN = env('APP_DOMAIN');

export const CLOUDINARY = {
  CLOUD_NAME: env('CLOUDINARY_CLOUD_NAME'),
  API_KEY: env('CLOUDINARY_API_KEY'),
  API_SECRET: env('CLOUDINARY_API_SECRET'),
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
