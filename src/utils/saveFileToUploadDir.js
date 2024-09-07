// src/utils/saveFileToUploadDir.js
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  console.log('Saving file to local upload directory:', file.filename);
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  const fileUrl = `${env('APP_DOMAIN')}/uploads/${file.filename}`;
  console.log('File saved to:', fileUrl);
  return fileUrl;
};
