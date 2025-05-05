import { AppDataSource } from '../config/database';
import path from 'path';
import fs from 'fs';

// Use a test database file
const TEST_DATABASE_PATH = path.join(process.cwd(), 'test-database.sqlite');
process.env.DATABASE_PATH = TEST_DATABASE_PATH;

// Function to initialize test database
export async function setupTestDatabase() {
  try {
    // Remove test database if it exists
    if (fs.existsSync(TEST_DATABASE_PATH)) {
      fs.unlinkSync(TEST_DATABASE_PATH);
    }
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Test database connection established');
    
    return AppDataSource;
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

// Function to close test database connection
export async function teardownTestDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Test database connection closed');
    }
  } catch (error) {
    console.error('Error closing test database connection:', error);
    throw error;
  }
}

// Function to clear all data from the test database
export async function clearTestDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      // Delete data in the correct order to respect foreign key constraints
      // First, delete child entities that reference other entities
      await AppDataSource.getRepository('InventoryMovement').clear();
      await AppDataSource.getRepository('Inventory').clear();
      await AppDataSource.getRepository('MenuItem').clear();
      await AppDataSource.getRepository('RecipeIngredient').clear();
      await AppDataSource.getRepository('Staff').clear();
      
      // Then delete parent entities
      await AppDataSource.getRepository('Modifier').clear();
      await AppDataSource.getRepository('Recipe').clear();
      await AppDataSource.getRepository('Ingredient').clear();
      await AppDataSource.getRepository('Location').clear();
      
      console.log('Test database cleared');
    }
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
}
