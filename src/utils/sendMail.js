// src/utils/sendMail.js
import nodemailer from 'nodemailer';
import net from 'net';

const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null;

let transporter;

if (!process.env.SMTP_HOST || !port || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.error('SMTP configuration is missing some required variables.');
} else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: false, // використовується STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    family: 4,  // Використання тільки IPv4
    localAddress: '0.0.0.0',  // Додано для явного задання адреси
  });

  // Перевірка з'єднання з SMTP сервером
  transporter.verify(function (error, success) {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to take messages');
    }
  });

  // Додано новий код для перевірки підключення до SMTP сервера
  const client = net.createConnection({ host: process.env.SMTP_HOST, port }, () => {
    console.log('Connected to SMTP server!');
    client.end();
  });

  client.on('error', (err) => {
    console.error('Connection error:', err);
  });
}

export const sendEmail = async (options) => {
  if (!transporter) {
    console.error('Transporter is not initialized.');
    return;
  }

  try {
    console.log('Attempting to send email with options:', options);
    const info = await transporter.sendMail(options);
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
