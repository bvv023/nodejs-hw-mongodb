// src/utils/googleOAuth2.js
import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { promises as fs } from 'fs';
import env from './env.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const loadOAuthConfig = async () => {
  try {
    const fileContent = await fs.readFile(PATH_JSON, 'utf8');
    const oauthConfig = JSON.parse(fileContent);

    if (!oauthConfig || !oauthConfig.web || !oauthConfig.web.redirect_uris || oauthConfig.web.redirect_uris.length === 0) {
      throw createHttpError(500, 'Invalid Google OAuth configuration');
    }

    return oauthConfig;
  } catch (error) {
    console.error('Failed to read Google OAuth configuration file:', error);
    throw createHttpError(500, 'Google OAuth configuration file missing or invalid');
  }
};

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: (await loadOAuthConfig()).web.redirect_uris[0],
});

console.log('GOOGLE_AUTH_CLIENT_ID:', env('GOOGLE_AUTH_CLIENT_ID'));
console.log('GOOGLE_AUTH_CLIENT_SECRET:', env('GOOGLE_AUTH_CLIENT_SECRET'));

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
