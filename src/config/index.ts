import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  base_url: process.env.BASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    password_secrect: process.env.JWT_FORGET_PASSWORD_SECRET,
    password_expires_in: process.env.JWT_FORGET_PASSWORD_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API,
    apiSecret: process.env.CLOUDINARY_SECRET,
  },
  provider: {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  node_mailer: {
    email: process.env.NODEMAILER_GMAIL,
    password: process.env.NODEMAILER_GMAIL_PASSWORD,
  },
};
