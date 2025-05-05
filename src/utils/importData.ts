import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { AppDataSource } from '../config/database';
import { Location } from '../models/Location';
import { Staff } from '../models/Staff';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { MenuItem } from '../models/MenuItem';
import { Modifier } from '../models/Modifier';
import { Inventory } from '../models/Inventory';

// Path to CSV files
const DATA_DIR = path.join(process.cwd(), 'data', 'csv');

// Helper function to parse CSV files
async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error: Error) => reject(error));
  });
}

// Import locations
async function importLocations(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'locations.csv');
    const data = await parseCSV(filePath);
    
    const locationRepository = AppDataSource.getRepository(Location);
    
    for (const item of data) {
      const location = new Location();
      location.location_id = parseInt(item.location_id);
      location.name = item.name;
      location.address = item.address;
      location.phone = item.phone || null;
      location.email = item.email || null;
      location.active = item.active === 'true';
      
      await locationRepository.save(location);
    }
    
    console.log(`Imported ${data.length} locations`);
  } catch (error) {
    console.error('Error importing locations:', error);
  }
}

// Import staff
async function importStaff(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'staff.csv');
    const data = await parseCSV(filePath);
    
    const staffRepository = AppDataSource.getRepository(Staff);
    
    // Create a map to handle duplicates
    const staffMap = new Map<number, Staff>();
    
    for (const item of data) {
      const staff = new Staff();
      staff.staff_id = parseInt(item.staff_id);
      staff.name = item.name;
      staff.location_id = parseInt(item.location_id);
      staff.role = item.role;
      staff.active = item.active === 'true';
      
      // Use the map to handle duplicates (last one wins)
      staffMap.set(staff.staff_id, staff);
    }
    
    // Save unique staff members
    for (const staff of staffMap.values()) {
      await staffRepository.save(staff);
    }
    
    console.log(`Imported ${staffMap.size} staff members`);
  } catch (error) {
    console.error('Error importing staff:', error);
  }
}

// Import ingredients
async function importIngredients(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'ingredients.csv');
    const data = await parseCSV(filePath);
    
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    
    for (const item of data) {
      const ingredient = new Ingredient();
      ingredient.ingredient_id = parseInt(item.ingredient_id);
      ingredient.name = item.name;
      ingredient.description = item.description || null;
      ingredient.cost = parseFloat(item.cost);
      ingredient.unit = item.unit;
      ingredient.active = item.active === 'true';
      
      await ingredientRepository.save(ingredient);
    }
    
    console.log(`Imported ${data.length} ingredients`);
  } catch (error) {
    console.error('Error importing ingredients:', error);
  }
}

// Import recipes and recipe ingredients
async function importRecipes(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'recipes.csv');
    const data = await parseCSV(filePath);
    
    const recipeRepository = AppDataSource.getRepository(Recipe);
    
    // Create a map to handle duplicates
    const recipeMap = new Map<number, Recipe>();
    
    for (const item of data) {
      const recipe = new Recipe();
      recipe.recipe_id = parseInt(item.recipe_id);
      recipe.name = item.name;
      recipe.description = item.description || null;
      recipe.active = item.active === 'true';
      
      // Use the map to handle duplicates (last one wins)
      recipeMap.set(recipe.recipe_id, recipe);
    }
    
    // Save unique recipes
    for (const recipe of recipeMap.values()) {
      await recipeRepository.save(recipe);
    }
    
    console.log(`Imported ${recipeMap.size} recipes`);
  } catch (error) {
    console.error('Error importing recipes:', error);
  }
}

// Import recipe ingredients
async function importRecipeIngredients(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'recipes.csv');
    const data = await parseCSV(filePath);
    
    const recipeIngredientRepository = AppDataSource.getRepository(RecipeIngredient);
    
    // Create a map to handle duplicates
    const recipeIngredientMap = new Map<string, RecipeIngredient>();
    
    for (const item of data) {
      if (item.ingredient_id && item.quantity) {
        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.recipe_id = parseInt(item.recipe_id);
        recipeIngredient.ingredient_id = parseInt(item.ingredient_id);
        recipeIngredient.quantity = parseFloat(item.quantity);
        
        // Create a unique key for the recipe ingredient
        const key = `${recipeIngredient.recipe_id}-${recipeIngredient.ingredient_id}`;
        
        // Use the map to handle duplicates (last one wins)
        recipeIngredientMap.set(key, recipeIngredient);
      }
    }
    
    // Save unique recipe ingredients
    for (const recipeIngredient of recipeIngredientMap.values()) {
      await recipeIngredientRepository.save(recipeIngredient);
    }
    
    console.log(`Imported ${recipeIngredientMap.size} recipe ingredients`);
  } catch (error) {
    console.error('Error importing recipe ingredients:', error);
  }
}

// Import menu items
async function importMenuItems(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'menus.csv');
    const data = await parseCSV(filePath);
    
    const menuItemRepository = AppDataSource.getRepository(MenuItem);
    
    for (const item of data) {
      const menuItem = new MenuItem();
      menuItem.menu_item_id = parseInt(item.menu_item_id);
      menuItem.location_id = parseInt(item.location_id);
      menuItem.recipe_id = parseInt(item.recipe_id);
      menuItem.name = item.name;
      menuItem.price = parseFloat(item.price);
      menuItem.active = item.active === 'true';
      
      await menuItemRepository.save(menuItem);
    }
    
    console.log(`Imported ${data.length} menu items`);
  } catch (error) {
    console.error('Error importing menu items:', error);
  }
}

// Import modifiers
async function importModifiers(): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, 'modifiers.csv');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('No modifiers.csv file found, skipping modifier import');
      return;
    }
    
    const data = await parseCSV(filePath);
    
    const modifierRepository = AppDataSource.getRepository(Modifier);
    
    for (const item of data) {
      const modifier = new Modifier();
      modifier.modifier_id = parseInt(item.modifier_id);
      modifier.name = item.name;
      modifier.option = item.option;
      modifier.price = parseFloat(item.price);
      
      await modifierRepository.save(modifier);
    }
    
    console.log(`Imported ${data.length} modifiers`);
  } catch (error) {
    console.error('Error importing modifiers:', error);
  }
}

// Initialize inventory for each location with zero quantities
async function initializeInventory(): Promise<void> {
  try {
    const locationRepository = AppDataSource.getRepository(Location);
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    
    const locations = await locationRepository.find();
    const ingredients = await ingredientRepository.find();
    
    let count = 0;
    
    for (const location of locations) {
      for (const ingredient of ingredients) {
        const inventory = new Inventory();
        inventory.location_id = location.location_id;
        inventory.ingredient_id = ingredient.ingredient_id;
        inventory.quantity = 0;
        inventory.unit = ingredient.unit;
        
        await inventoryRepository.save(inventory);
        count++;
      }
    }
    
    console.log(`Initialized ${count} inventory records with zero quantities`);
  } catch (error) {
    console.error('Error initializing inventory:', error);
  }
}

// Main function to import all data
async function importAllData(): Promise<void> {
  try {
    // Create data/csv directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Initialize database
    await AppDataSource.initialize();
    console.log('Database connection established');
    
    // Import data in the correct order to maintain referential integrity
    await importLocations();
    await importIngredients();
    await importStaff();
    await importRecipes();
    await importRecipeIngredients();
    await importMenuItems();
    await importModifiers();
    await initializeInventory();
    
    console.log('Data import completed successfully');
    
    // Close the database connection
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importAllData().catch(console.error);
}

export { importAllData };
