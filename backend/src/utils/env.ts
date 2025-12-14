import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || ''
};
