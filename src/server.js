// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contactsRouter.js';
import authRouter from './routers/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(pino());

  app.use(express.json());

  app.use(cookieParser());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'mySuperSecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  }));

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
