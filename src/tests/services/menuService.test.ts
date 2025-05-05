import { expect } from 'chai';
import { InventoryService } from '../../services/inventoryService';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData } from '../testHelpers';

describe('Menu and Staff Service Functions', () => {
  let inventoryService: InventoryService;

  before(async () => {
    // Set up test database
    await setupTestDatabase();
    inventoryService = new InventoryService();
  });

  beforeEach(async () => {
    // Clear database and seed with test data before each test
    await clearTestDatabase();
    await seedTestData();
  });

  after(async () => {
    // Close database connection after all tests
    await teardownTestDatabase();
  });

  describe('getMenuItems', () => {
    it('should return menu items for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getMenuItems(locationId);
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].location_id).to.equal(locationId);
      expect(result[0]).to.have.property('menu_item_id');
      expect(result[0]).to.have.property('recipe_id');
      expect(result[0]).to.have.property('name');
      expect(result[0]).to.have.property('price');
      expect(result[0]).to.have.property('recipe');
    });
    
    it('should return only active menu items', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getMenuItems(locationId);
      
      // Assert
      expect(result).to.be.an('array');
      result.forEach(menuItem => {
        expect(menuItem.active).to.be.true;
      });
    });
    
    it('should return empty array for non-existent location', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act
      const result = await inventoryService.getMenuItems(nonExistentLocationId);
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });
  });
  
  describe('getStaff', () => {
    it('should return staff for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getStaff(locationId);
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].location_id).to.equal(locationId);
      expect(result[0]).to.have.property('staff_id');
      expect(result[0]).to.have.property('name');
      expect(result[0]).to.have.property('role');
    });
    
    it('should return only active staff', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getStaff(locationId);
      
      // Assert
      expect(result).to.be.an('array');
      result.forEach(staff => {
        expect(staff.active).to.be.true;
      });
    });
    
    it('should return empty array for non-existent location', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act
      const result = await inventoryService.getStaff(nonExistentLocationId);
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });
  });
});
