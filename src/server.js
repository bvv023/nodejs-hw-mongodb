// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import contactsRouter from './routers/contactsRouter.js';
import authRouter from './routers/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import env from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use(session({
    secret: env('SESSION_SECRET', 'mySuperSecret'),
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${env('MONGODB_USER')}:${env('MONGODB_PASSWORD')}@${env('MONGODB_URL')}/${env('MONGODB_DB')}`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  }));

  const swaggerDocument = YAML.load(path.join(process.cwd(), './docs/openapi.yaml'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = env('PORT', 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${env('NODE_ENV', 'development')} mode`);
  });
};

export default setupServer;
