import { expect } from 'chai';
import { InventoryService } from '../../services/inventoryService';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData, createDeliveryData, createSaleData, createStockAdjustmentData } from '../testHelpers';
import { AppDataSource } from '../../config/database';
import { MovementType } from '../../models/InventoryMovement';

describe('Report Service Functions', () => {
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
    
    // Create some movements for testing reports
    const deliveryData = createDeliveryData();
    await inventoryService.acceptDelivery(deliveryData);
    
    const saleData = createSaleData();
    await inventoryService.sellItem(saleData);
    
    const stockData = createStockAdjustmentData();
    stockData.actualQuantity = 5; // Less than current quantity to simulate waste
    await inventoryService.takeStock(stockData);
  });

  after(async () => {
    // Close database connection after all tests
    await teardownTestDatabase();
  });

  describe('getInventoryMovements', () => {
    it('should return all movements for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getInventoryMovements({ locationId });
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].location_id).to.equal(locationId);
      expect(result[0]).to.have.property('type');
      expect(result[0]).to.have.property('timestamp');
    });
    
    it('should filter movements by type', async () => {
      // Arrange
      const locationId = 1;
      const movementType = MovementType.DELIVERY;
      
      // Act
      const result = await inventoryService.getInventoryMovements({ 
        locationId, 
        movementType 
      });
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].location_id).to.equal(locationId);
      expect(result[0].type).to.equal(movementType);
    });
    
    it('should filter movements by date range', async () => {
      // Arrange
      const locationId = 1;
      
      // Create a delivery with a specific timestamp to ensure we have data
      const deliveryData = createDeliveryData();
      await inventoryService.acceptDelivery(deliveryData);
      
      // Use a very wide date range to ensure we capture all movements
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2030-01-01');
      
      // Act
      const result = await inventoryService.getInventoryMovements({ 
        locationId, 
        startDate,
        endDate
      });
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0].location_id).to.equal(locationId);
    });
  });
  
  describe('getReportSummary', () => {
    it('should generate a report summary for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const result = await inventoryService.getReportSummary({ locationId });
      
      // Assert
      expect(result).to.be.an('object');
      expect(result).to.have.property('totalDeliveryCost');
      expect(result).to.have.property('totalSalesRevenue');
      expect(result).to.have.property('totalWasteCost');
      expect(result).to.have.property('totalInventoryValue');
      
      // Verify the values are numbers
      expect(typeof result.totalDeliveryCost).to.equal('number');
      expect(typeof result.totalSalesRevenue).to.equal('number');
      expect(typeof result.totalWasteCost).to.equal('number');
      expect(typeof result.totalInventoryValue).to.equal('number');
    });
    
    it('should filter report by date range', async () => {
      // Arrange
      const locationId = 1;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1); // Yesterday
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // Tomorrow
      
      // Act
      const result = await inventoryService.getReportSummary({ 
        locationId, 
        startDate,
        endDate
      });
      
      // Assert
      expect(result).to.be.an('object');
      expect(result).to.have.property('totalDeliveryCost');
      expect(result).to.have.property('totalSalesRevenue');
      expect(result).to.have.property('totalWasteCost');
      expect(result).to.have.property('totalInventoryValue');
    });
  });
});
