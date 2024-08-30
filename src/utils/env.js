// src/utils/env.js
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('ENV variables successfully loaded from', envPath);
} else {
  console.error('Could not find .env file at', envPath);
  process.exit(1);
}

const env = (key, defaultValue = undefined) => {
  return process.env[key] || defaultValue;
};

export default env;
