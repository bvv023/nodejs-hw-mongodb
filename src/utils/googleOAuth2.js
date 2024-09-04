// src/utils/googleOAuth2.js
import { OAuth2Client } from 'google-auth-library';
import env from './env.js';
import createHttpError from 'http-errors';

// Ініціалізація клієнта OAuth2 без використання файлу oauthConfig
const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
});

// Оновлено для динамічного визначення redirectUri
export const generateAuthUrl = (redirectUri) => {
  const authUrl = googleOAuthClient.generateAuthUrl({
    redirect_uri: redirectUri, // Використовуємо передану URL-адресу
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
