// src/index.js
import dotenv from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

dotenv.config();

(async () => {
  await initMongoConnection();
  setupServer();
})();
