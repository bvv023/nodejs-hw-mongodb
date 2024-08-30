// src/db/initMongoConnection.js
import mongoose from 'mongoose';
import env from '../utils/env.js';

const initMongoConnection = async () => {
  try {
    const connectionString = `mongodb+srv://${env('MONGODB_USER')}:${env('MONGODB_PASSWORD')}@${env('MONGODB_URL')}/${env('MONGODB_DB')}`;
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
};

export default initMongoConnection;
