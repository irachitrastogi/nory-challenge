import { Location } from '../models/Location';
import { Staff } from '../models/Staff';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';
import { RecipeIngredient } from '../models/RecipeIngredient';
import { MenuItem } from '../models/MenuItem';
import { Inventory } from '../models/Inventory';
import { AppDataSource } from '../config/database';

// Mock data for testing
export const mockData = {
  location: {
    location_id: 1,
    name: 'Test Location',
    address: '123 Test Street',
    phone: '123-456-7890',
    email: 'test@example.com',
    active: true
  },
  staff: {
    staff_id: 1,
    name: 'Test Staff',
    location_id: 1,
    role: 'Manager',
    active: true
  },
  ingredient: {
    ingredient_id: 1,
    name: 'Test Ingredient',
    description: 'Test Description',
    cost: 5.99,
    unit: 'kg',
    active: true
  },
  recipe: {
    recipe_id: 1,
    name: 'Test Recipe',
    description: 'Test Recipe Description',
    active: true
  },
  recipeIngredient: {
    recipe_ingredient_id: 1,
    recipe_id: 1,
    ingredient_id: 1,
    quantity: 0.5
  },
  menuItem: {
    menu_item_id: 1,
    location_id: 1,
    recipe_id: 1,
    name: 'Test Menu Item',
    price: 9.99,
    active: true
  },
  inventory: {
    inventory_id: 1,
    location_id: 1,
    ingredient_id: 1,
    quantity: 10,
    unit: 'kg'
  }
};

// Helper function to seed test data
export async function seedTestData() {
  try {
    // Create location
    const locationRepository = AppDataSource.getRepository(Location);
    const location = locationRepository.create(mockData.location);
    await locationRepository.save(location);
    
    // Create staff
    const staffRepository = AppDataSource.getRepository(Staff);
    const staff = staffRepository.create(mockData.staff);
    await staffRepository.save(staff);
    
    // Create ingredient
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const ingredient = ingredientRepository.create(mockData.ingredient);
    await ingredientRepository.save(ingredient);
    
    // Create recipe
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = recipeRepository.create(mockData.recipe);
    await recipeRepository.save(recipe);
    
    // Create recipe ingredient
    const recipeIngredientRepository = AppDataSource.getRepository(RecipeIngredient);
    const recipeIngredient = recipeIngredientRepository.create(mockData.recipeIngredient);
    await recipeIngredientRepository.save(recipeIngredient);
    
    // Create menu item
    const menuItemRepository = AppDataSource.getRepository(MenuItem);
    const menuItem = menuItemRepository.create(mockData.menuItem);
    await menuItemRepository.save(menuItem);
    
    // Create inventory
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = inventoryRepository.create(mockData.inventory);
    await inventoryRepository.save(inventory);
    
    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
}

// Helper function to create a delivery data object
export function createDeliveryData() {
  return {
    locationId: mockData.location.location_id,
    staffId: mockData.staff.staff_id,
    ingredientId: mockData.ingredient.ingredient_id,
    quantity: 5,
    cost: 29.95
  };
}

// Helper function to create a sale data object
export function createSaleData() {
  return {
    locationId: mockData.location.location_id,
    staffId: mockData.staff.staff_id,
    recipeId: mockData.recipe.recipe_id,
    quantity: 1,
    notes: 'Test sale'
  };
}

// Helper function to create a stock adjustment data object
export function createStockAdjustmentData() {
  return {
    locationId: mockData.location.location_id,
    staffId: mockData.staff.staff_id,
    ingredientId: mockData.ingredient.ingredient_id,
    actualQuantity: 8, // Less than current quantity to simulate waste
    notes: 'Stock count adjustment'
  };
}
