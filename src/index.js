// src/index.js
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import env from './utils/env.js';

const bootstrap = async () => {
  try {
    console.log('Loaded ENV variables:');
    console.log('SMTP_HOST:', env('SMTP_HOST'));
    console.log('SMTP_PORT:', env('SMTP_PORT'));
    console.log('SMTP_USER:', env('SMTP_USER'));
    console.log('SMTP_FROM:', env('SMTP_FROM'));

    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.error('Application initialization error:', error);
    process.exit(1);
  }
};

void bootstrap();
