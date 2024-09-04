// src/middlewares/swaggerDocs.js
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error('Failed to load Swagger docs:', err);
    return (req, res, next) =>
      next(new Error("Can't load swagger docs"));
  }
};
