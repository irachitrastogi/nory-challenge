import { AppDataSource } from "../config/database";
import { Inventory } from "../models/Inventory";
import { InventoryMovement, MovementType } from "../models/InventoryMovement";
import { Ingredient } from "../models/Ingredient";
import { Recipe } from "../models/Recipe";
import { RecipeIngredient } from "../models/RecipeIngredient";
import { MenuItem } from "../models/MenuItem";

// Interface for delivery data
interface DeliveryData {
  locationId: number;
  staffId: number;
  ingredientId: number;
  quantity: number;
  cost: number;
  reference?: string;
  notes?: string;
}

// Interface for sale data
interface SaleData {
  locationId: number;
  staffId: number;
  menuItemId: number;
  quantity: number;
  notes?: string;
}

// Interface for stock adjustment data
interface StockAdjustmentData {
  locationId: number;
  staffId: number;
  ingredientId: number;
  actualQuantity: number;
  notes?: string;
}

// Interface for report filters
interface ReportFilters {
  locationId: number;
  startDate?: Date;
  endDate?: Date;
  movementType?: MovementType;
}

// Interface for report summary
interface ReportSummary {
  totalDeliveryCost: number;
  totalSalesRevenue: number;
  totalWasteCost: number;
  totalInventoryValue: number;
}

/**
 * Service for managing inventory operations
 */
export class InventoryService {
  /**
   * Accept a delivery of ingredients
   */
  async acceptDelivery(data: DeliveryData): Promise<InventoryMovement> {
    const { locationId, staffId, ingredientId, quantity, cost, reference, notes } = data;
    
    // Start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Get current inventory
      const inventoryRepository = queryRunner.manager.getRepository(Inventory);
      let inventory = await inventoryRepository.findOne({
        where: {
          location_id: locationId,
          ingredient_id: ingredientId
        }
      });
      
      if (!inventory) {
        // Create new inventory record if it doesn't exist
        inventory = new Inventory();
        inventory.location_id = locationId;
        inventory.ingredient_id = ingredientId;
        inventory.quantity = 0;
      }
      
      // Update inventory quantity
      inventory.quantity = Number(inventory.quantity) + Number(quantity);
      await inventoryRepository.save(inventory);
      
      // Create inventory movement record
      const movementRepository = queryRunner.manager.getRepository(InventoryMovement);
      const movement = new InventoryMovement();
      movement.location_id = locationId;
      movement.staff_id = staffId;
      movement.ingredient_id = ingredientId;
      movement.quantity = quantity;
      movement.type = MovementType.DELIVERY;
      movement.reference = reference || null;
      movement.cost = cost;
      movement.revenue = null;
      movement.notes = notes || null;
      
      const savedMovement = await movementRepository.save(movement);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return savedMovement;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Sell a menu item, reducing inventory for all ingredients in the recipe
   */
  async sellItem(data: SaleData): Promise<InventoryMovement[]> {
    const { locationId, staffId, menuItemId, quantity, notes } = data;
    
    // Start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Get the menu item to calculate revenue
      const menuItemRepository = queryRunner.manager.getRepository(MenuItem);
      const menuItem = await menuItemRepository.findOne({
        where: {
          menu_item_id: menuItemId,
          location_id: locationId
        },
        relations: ["recipe"]
      });
      
      if (!menuItem) {
        throw new Error(`Menu item not found for location ${locationId} and ID ${menuItemId}`);
      }
      
      // Get the recipe ingredients
      const recipeIngredientRepository = queryRunner.manager.getRepository(RecipeIngredient);
      const recipeIngredients = await recipeIngredientRepository.find({
        where: {
          recipe_id: menuItem.recipe_id
        },
        relations: ["ingredient"]
      });
      
      if (recipeIngredients.length === 0) {
        throw new Error(`No ingredients found for recipe ${menuItem.recipe_id}`);
      }
      
      // Check if there's enough inventory for all ingredients
      const inventoryRepository = queryRunner.manager.getRepository(Inventory);
      const movements: InventoryMovement[] = [];
      
      for (const recipeIngredient of recipeIngredients) {
        const requiredQuantity = recipeIngredient.quantity * quantity;
        
        // Skip if quantity is zero (some recipes might have optional ingredients)
        if (requiredQuantity === 0) continue;
        
        const inventory = await inventoryRepository.findOne({
          where: {
            location_id: locationId,
            ingredient_id: recipeIngredient.ingredient_id
          }
        });
        
        if (!inventory) {
          throw new Error(`Inventory record not found for location ${locationId} and ingredient ${recipeIngredient.ingredient_id}`);
        }
        
        if (Number(inventory.quantity) < requiredQuantity) {
          throw new Error(`Not enough inventory for ingredient ${recipeIngredient.ingredient.name}. Required: ${requiredQuantity}, Available: ${inventory.quantity}`);
        }
      }
      
      // Update inventory and create movement records for each ingredient
      const movementRepository = queryRunner.manager.getRepository(InventoryMovement);
      const totalRevenue = Number(menuItem.price) * quantity;
      
      for (const recipeIngredient of recipeIngredients) {
        const requiredQuantity = recipeIngredient.quantity * quantity;
        
        // Skip if quantity is zero
        if (requiredQuantity === 0) continue;
        
        // Update inventory
        const inventory = await inventoryRepository.findOne({
          where: {
            location_id: locationId,
            ingredient_id: recipeIngredient.ingredient_id
          }
        });
        
        inventory.quantity = Number(inventory.quantity) - requiredQuantity;
        await inventoryRepository.save(inventory);
        
        // Create movement record
        const movement = new InventoryMovement();
        movement.location_id = locationId;
        movement.staff_id = staffId;
        movement.ingredient_id = recipeIngredient.ingredient_id;
        movement.quantity = -requiredQuantity; // Negative for sales
        movement.type = MovementType.SALE;
        movement.reference = menuItemId.toString();
        movement.cost = null;
        movement.revenue = totalRevenue / recipeIngredients.length; // Distribute revenue evenly among ingredients
        movement.notes = notes || null;
        
        const savedMovement = await movementRepository.save(movement);
        movements.push(savedMovement);
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return movements;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Take stock and adjust inventory, recording waste if actual quantity is less than expected
   */
  async takeStock(data: StockAdjustmentData): Promise<InventoryMovement> {
    const { locationId, staffId, ingredientId, actualQuantity, notes } = data;
    
    // Start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Get current inventory
      const inventoryRepository = queryRunner.manager.getRepository(Inventory);
      const inventory = await inventoryRepository.findOne({
        where: {
          location_id: locationId,
          ingredient_id: ingredientId
        },
        relations: ["ingredient"]
      });
      
      if (!inventory) {
        throw new Error(`Inventory record not found for location ${locationId} and ingredient ${ingredientId}`);
      }
      
      // Calculate difference
      const expectedQuantity = Number(inventory.quantity);
      const difference = Number(actualQuantity) - expectedQuantity;
      
      // Create movement record
      const movementRepository = queryRunner.manager.getRepository(InventoryMovement);
      const movement = new InventoryMovement();
      movement.location_id = locationId;
      movement.staff_id = staffId;
      movement.ingredient_id = ingredientId;
      movement.quantity = difference;
      
      // If actual is less than expected, it's waste
      if (difference < 0) {
        movement.type = MovementType.WASTE;
        movement.cost = Math.abs(difference) * Number(inventory.ingredient.cost); // Cost of wasted inventory
        movement.revenue = null;
      } else {
        movement.type = MovementType.ADJUSTMENT;
        movement.cost = null;
        movement.revenue = null;
      }
      
      movement.reference = null;
      movement.notes = notes || null;
      
      // Update inventory to actual quantity
      inventory.quantity = actualQuantity;
      await inventoryRepository.save(inventory);
      
      const savedMovement = await movementRepository.save(movement);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return savedMovement;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  
  /**
   * Get current inventory for a location
   */
  async getCurrentInventory(locationId: number): Promise<Inventory[]> {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    
    const inventory = await inventoryRepository.find({
      where: {
        location_id: locationId
      },
      relations: ["ingredient"]
    });
    
    return inventory;
  }
  
  /**
   * Get inventory movements based on filters
   */
  async getInventoryMovements(filters: ReportFilters): Promise<InventoryMovement[]> {
    const { locationId, startDate, endDate, movementType } = filters;
    
    const movementRepository = AppDataSource.getRepository(InventoryMovement);
    const queryBuilder = movementRepository.createQueryBuilder("movement")
      .leftJoinAndSelect("movement.ingredient", "ingredient")
      .leftJoinAndSelect("movement.staff", "staff")
      .where("movement.location_id = :locationId", { locationId });
    
    if (movementType) {
      queryBuilder.andWhere("movement.type = :movementType", { movementType });
    }
    
    if (startDate) {
      queryBuilder.andWhere("movement.timestamp >= :startDate", { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere("movement.timestamp <= :endDate", { endDate });
    }
    
    queryBuilder.orderBy("movement.timestamp", "DESC");
    
    const movements = await queryBuilder.getMany();
    
    return movements;
  }
  
  /**
   * Generate a report summary
   */
  async getReportSummary(filters: ReportFilters): Promise<ReportSummary> {
    const { locationId } = filters;
    
    // Get all movements for the period
    const movements = await this.getInventoryMovements(filters);
    
    // Calculate summary statistics
    let totalDeliveryCost = 0;
    let totalSalesRevenue = 0;
    let totalWasteCost = 0;
    
    for (const movement of movements) {
      if (movement.type === MovementType.DELIVERY && movement.cost) {
        totalDeliveryCost += Number(movement.cost);
      } else if (movement.type === MovementType.SALE && movement.revenue) {
        totalSalesRevenue += Number(movement.revenue);
      } else if (movement.type === MovementType.WASTE && movement.cost) {
        totalWasteCost += Number(movement.cost);
      }
    }
    
    // Calculate current inventory value
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventoryItems = await inventoryRepository.find({
      where: {
        location_id: locationId
      },
      relations: ["ingredient"]
    });
    
    let totalInventoryValue = 0;
    for (const item of inventoryItems) {
      totalInventoryValue += Number(item.quantity) * Number(item.ingredient.cost);
    }
    
    return {
      totalDeliveryCost,
      totalSalesRevenue,
      totalWasteCost,
      totalInventoryValue
    };
  }
  
  /**
   * Get available menu items for a location
   */
  async getMenuItems(locationId: number): Promise<MenuItem[]> {
    const menuItemRepository = AppDataSource.getRepository(MenuItem);
    
    const menuItems = await menuItemRepository.find({
      where: {
        location_id: locationId,
        active: true
      },
      relations: ["recipe"]
    });
    
    return menuItems;
  }
}
