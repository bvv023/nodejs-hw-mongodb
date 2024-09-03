// src/utils/env.js
import dotenv from 'dotenv';

dotenv.config();

const env = (name, defaultValue) => {
  const value = process.env[name];
  if (value) {
    console.log(`Loaded environment variable ${name}: ${value}`);
    return value;
  }

  if (defaultValue) {
    console.warn(`Environment variable ${name} not found. Using default value: ${defaultValue}`);
    return defaultValue;
  }

  console.error(`Environment variable ${name} is missing and no default value was provided`);
  throw new Error(`${name} variable doesn't exist`);
};

export default env;
