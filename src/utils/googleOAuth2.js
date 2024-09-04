// src/utils/googleOAuth2.js
import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { promises as fs } from 'fs';
import env from './env.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

let oauthConfig;

const loadOAuthConfig = async () => {
  try {
    const fileContent = await fs.readFile(PATH_JSON, 'utf8');
    oauthConfig = JSON.parse(fileContent);
    console.log('Google OAuth configuration loaded successfully');
  } catch (error) {
    console.error('Failed to read Google OAuth configuration file:', error);
    throw createHttpError(500, 'Google OAuth configuration file missing or invalid');
  }
};

await loadOAuthConfig();

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () => {
  const authUrl = googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
  console.log('Generated Google Auth URL:', authUrl);
  return authUrl;
};

export const validateCode = async (code) => {
  try {
    const response = await googleOAuthClient.getToken(code);
    if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
    });
    console.log('Google OAuth token validated successfully');
    return ticket.getPayload();
  } catch (error) {
    console.error('Error during token validation:', error);
    throw error;
  }
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  console.log('Extracted full name from Google token payload:', fullName);
  return fullName;
};
