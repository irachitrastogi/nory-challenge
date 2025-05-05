import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData, createDeliveryData, createSaleData, createStockAdjustmentData } from '../testHelpers';

describe('Inventory API Routes', () => {
  before(async () => {
    // Set up test database
    await setupTestDatabase();
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

  describe('POST /api/inventory/delivery', () => {
    it('should accept a delivery and return 201 status', async () => {
      // Arrange
      const deliveryData = createDeliveryData();
      
      // Act
      const response = await request(app)
        .post('/api/inventory/delivery')
        .send(deliveryData)
        .expect(201);
      
      // Assert
      expect(response.body).to.have.property('movement_id');
      expect(response.body.location_id).to.equal(deliveryData.locationId);
      expect(response.body.ingredient_id).to.equal(deliveryData.ingredientId);
      expect(response.body.quantity).to.equal(deliveryData.quantity);
      expect(response.body.type).to.equal('delivery');
    });
    
    it('should return 400 if delivery data is invalid', async () => {
      // Arrange - Missing required fields
      const invalidData = {
        locationId: 1
        // Missing other required fields
      };
      
      // Act & Assert
      await request(app)
        .post('/api/inventory/delivery')
        .send(invalidData)
        .expect(400);
    });
  });
  
  describe('POST /api/inventory/sale', () => {
    it('should record a sale and return 201 status', async () => {
      // Arrange
      const saleData = createSaleData();
      
      // Act
      const response = await request(app)
        .post('/api/inventory/sale')
        .send(saleData)
        .expect(201);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0]).to.have.property('movement_id');
      expect(response.body[0].location_id).to.equal(saleData.locationId);
      expect(response.body[0].type).to.equal('sale');
    });
    
    it('should return 400 if sale data is invalid', async () => {
      // Arrange - Missing required fields
      const invalidData = {
        locationId: 1
        // Missing other required fields
      };
      
      // Act & Assert
      await request(app)
        .post('/api/inventory/sale')
        .send(invalidData)
        .expect(400);
    });
    
    it('should return 400 if inventory is insufficient', async () => {
      // Arrange
      const saleData = createSaleData();
      saleData.quantity = 100; // Very large quantity to ensure insufficient inventory
      
      // Act & Assert
      await request(app)
        .post('/api/inventory/sale')
        .send(saleData)
        .expect(400);
    });
  });
  
  describe('POST /api/inventory/stock', () => {
    it('should adjust inventory based on stock count and return 201 status', async () => {
      // Arrange
      const stockData = createStockAdjustmentData();
      stockData.actualQuantity = 5; // Less than current quantity (10) to simulate waste
      
      // Act
      const response = await request(app)
        .post('/api/inventory/stock')
        .send(stockData)
        .expect(201);
      
      // Assert
      expect(response.body).to.have.property('movement_id');
      expect(response.body.location_id).to.equal(stockData.locationId);
      expect(response.body.ingredient_id).to.equal(stockData.ingredientId);
      expect(response.body.type).to.equal('waste');
    });
    
    it('should return 400 if stock data is invalid', async () => {
      // Arrange - Missing required fields
      const invalidData = {
        locationId: 1
        // Missing other required fields
      };
      
      // Act & Assert
      await request(app)
        .post('/api/inventory/stock')
        .send(invalidData)
        .expect(400);
    });
  });
  
  describe('GET /api/inventory/:locationId', () => {
    it('should return inventory for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/inventory/${locationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0].location_id).to.equal(locationId);
      expect(response.body[0]).to.have.property('ingredient');
    });
    
    it('should return empty array for non-existent location', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act
      const response = await request(app)
        .get(`/api/inventory/${nonExistentLocationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(0);
    });
  });
  
  describe('GET /api/inventory/recipe/:recipeId/ingredients', () => {
    it('should return ingredients for a recipe', async () => {
      // Arrange
      const recipeId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/inventory/recipe/${recipeId}/ingredients`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0].recipe_id).to.equal(recipeId);
      expect(response.body[0]).to.have.property('ingredient');
    });
    
    it('should return empty array for non-existent recipe', async () => {
      // Arrange
      const nonExistentRecipeId = 999;
      
      // Act
      const response = await request(app)
        .get(`/api/inventory/recipe/${nonExistentRecipeId}/ingredients`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(0);
    });
  });
  
  describe('GET /api/reports/movements/:locationId', () => {
    it('should return inventory movements for a location', async () => {
      // First create a delivery to ensure we have a movement
      const deliveryData = createDeliveryData();
      await request(app)
        .post('/api/inventory/delivery')
        .send(deliveryData);
      
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/reports/movements/${locationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0].location_id).to.equal(locationId);
    });
  });
  
  describe('GET /api/reports/summary/:locationId', () => {
    it('should return a report summary for a location', async () => {
      // First create a delivery to ensure we have data for the report
      const deliveryData = createDeliveryData();
      await request(app)
        .post('/api/inventory/delivery')
        .send(deliveryData);
      
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/reports/summary/${locationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.have.property('totalDeliveryCost');
      expect(response.body).to.have.property('totalSalesRevenue');
      expect(response.body).to.have.property('totalWasteCost');
      expect(response.body).to.have.property('totalInventoryValue');
    });
  });
});
