import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database path from environment or default
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/inventory.sqlite');

// Create TypeORM data source
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../models/**/*.{js,ts}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{js,ts}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{js,ts}')],
});
