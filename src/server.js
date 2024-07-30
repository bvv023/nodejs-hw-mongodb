// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contactsRouter.js';

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(pino());

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.use('/contacts', contactsRouter);

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
