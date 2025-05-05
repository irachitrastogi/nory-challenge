import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import { Location } from '../models/Location';
import { Staff } from '../models/Staff';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { MenuItem } from '../models/MenuItem';
import { Inventory } from '../models/Inventory';
import { InventoryMovement } from '../models/InventoryMovement';

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
  entities: [
    Location,
    Staff,
    Ingredient,
    Recipe,
    RecipeIngredient,
    MenuItem,
    Inventory,
    InventoryMovement
  ],
  migrations: [path.join(__dirname, '../migrations/**/*.{js,ts}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{js,ts}')],
});
