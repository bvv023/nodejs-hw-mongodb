// src/server.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import pinoLogger from 'pino';
import fs from 'fs/promises';

import authRouter from './routers/authRouter.js';
import contactsRouter from './routers/contactsRouter.js';

import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';

import { UPLOAD_DIR } from './constants/index.js';
import env from './utils/env.js';

const logger = pinoLogger({
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
        },
      },
    ],
  },
});

const setupServer = async () => {
  const app = express();

  const swaggerDocument = JSON.parse(await fs.readFile(new URL('../docs/swagger.json', import.meta.url), 'utf8'));

  app.use(cookieParser());
  app.use(express.json());

  app.use(cors({
    origin: 'http://localhost:3000', // Дозволяє запити з цього домену
    credentials: true
  }));

  app.use(pinoHttp({ logger }));

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(env('PORT'));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

export default setupServer;
