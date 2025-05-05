import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { AppDataSource } from '../config/database';
import { Location } from '../models/Location';
import { Staff } from '../models/Staff';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { MenuItem } from '../models/MenuItem';
import { Inventory } from '../models/Inventory';

/**
 * Import data from CSV files into the database
 */
async function importData() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Import locations
    await importLocations();
    
    // Import staff
    await importStaff();
    
    // Import ingredients
    await importIngredients();
    
    // Import recipes
    await importRecipes();
    
    // Import recipe ingredients
    await importRecipeIngredients();
    
    // Import menu items
    await importMenuItems();
    
    // Import inventory
    await importInventory();
    
    console.log('Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  }
}

/**
 * Import locations from CSV
 */
async function importLocations() {
  const locationRepository = AppDataSource.getRepository(Location);
  const locations: Location[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/locations.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const location = new Location();
        location.location_id = parseInt(data.location_id);
        location.name = data.name;
        location.address = data.address;
        location.phone = data.phone;
        location.email = data.email;
        location.active = data.active === 'true';
        
        locations.push(location);
      })
      .on('end', async () => {
        try {
          await locationRepository.save(locations);
          console.log(`Imported ${locations.length} locations`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import staff from CSV
 */
async function importStaff() {
  const staffRepository = AppDataSource.getRepository(Staff);
  const staff: Staff[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/staff.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const staffMember = new Staff();
        staffMember.staff_id = parseInt(data.staff_id);
        staffMember.name = data.name;
        staffMember.location_id = parseInt(data.location_id);
        staffMember.role = data.role;
        staffMember.active = data.active === 'true';
        
        staff.push(staffMember);
      })
      .on('end', async () => {
        try {
          await staffRepository.save(staff);
          console.log(`Imported ${staff.length} staff members`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import ingredients from CSV
 */
async function importIngredients() {
  const ingredientRepository = AppDataSource.getRepository(Ingredient);
  const ingredients: Ingredient[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/ingredients.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const ingredient = new Ingredient();
        ingredient.ingredient_id = parseInt(data.ingredient_id);
        ingredient.name = data.name;
        ingredient.description = data.description;
        ingredient.cost = parseFloat(data.cost);
        ingredient.unit = data.unit;
        ingredient.active = data.active === 'true';
        
        ingredients.push(ingredient);
      })
      .on('end', async () => {
        try {
          await ingredientRepository.save(ingredients);
          console.log(`Imported ${ingredients.length} ingredients`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import recipes from CSV
 */
async function importRecipes() {
  const recipeRepository = AppDataSource.getRepository(Recipe);
  const recipes: Recipe[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/recipes.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const recipe = new Recipe();
        recipe.recipe_id = parseInt(data.recipe_id);
        recipe.name = data.name;
        recipe.description = data.description;
        recipe.active = data.active === 'true';
        
        recipes.push(recipe);
      })
      .on('end', async () => {
        try {
          await recipeRepository.save(recipes);
          console.log(`Imported ${recipes.length} recipes`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import recipe ingredients from CSV
 */
async function importRecipeIngredients() {
  const recipeIngredientRepository = AppDataSource.getRepository(RecipeIngredient);
  const recipeIngredients: RecipeIngredient[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/recipe_ingredients.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.recipe_ingredient_id = parseInt(data.recipe_ingredient_id);
        recipeIngredient.recipe_id = parseInt(data.recipe_id);
        recipeIngredient.ingredient_id = parseInt(data.ingredient_id);
        recipeIngredient.quantity = parseFloat(data.quantity);
        
        recipeIngredients.push(recipeIngredient);
      })
      .on('end', async () => {
        try {
          await recipeIngredientRepository.save(recipeIngredients);
          console.log(`Imported ${recipeIngredients.length} recipe ingredients`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import menu items from CSV
 */
async function importMenuItems() {
  const menuItemRepository = AppDataSource.getRepository(MenuItem);
  const menuItems: MenuItem[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/menu_items.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const menuItem = new MenuItem();
        menuItem.menu_item_id = parseInt(data.menu_item_id);
        menuItem.location_id = parseInt(data.location_id);
        menuItem.recipe_id = parseInt(data.recipe_id);
        menuItem.name = data.name;
        menuItem.price = parseFloat(data.price);
        menuItem.active = data.active === 'true';
        
        menuItems.push(menuItem);
      })
      .on('end', async () => {
        try {
          await menuItemRepository.save(menuItems);
          console.log(`Imported ${menuItems.length} menu items`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Import inventory from CSV
 */
async function importInventory() {
  const inventoryRepository = AppDataSource.getRepository(Inventory);
  const inventoryItems: Inventory[] = [];
  
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/inventory.csv'))
      .pipe(csv())
      .on('data', (data) => {
        const inventory = new Inventory();
        inventory.inventory_id = parseInt(data.inventory_id);
        inventory.location_id = parseInt(data.location_id);
        inventory.ingredient_id = parseInt(data.ingredient_id);
        inventory.quantity = parseFloat(data.quantity);
        inventory.unit = data.unit;
        
        inventoryItems.push(inventory);
      })
      .on('end', async () => {
        try {
          await inventoryRepository.save(inventoryItems);
          console.log(`Imported ${inventoryItems.length} inventory items`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Run the import
importData();
