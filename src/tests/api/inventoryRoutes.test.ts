import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData, createDeliveryData } from '../testHelpers';
import { setupRoutes } from '../../api/routes';

describe('Inventory API Routes', () => {
  let app: express.Express;

  before(async () => {
    // Set up test database
    await setupTestDatabase();
    
    // Create Express app for testing
    app = express();
    app.use(express.json());
    setupRoutes(app);
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
        .expect('Content-Type', /json/);
      
      // Assert
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('location_id', deliveryData.locationId);
      expect(response.body).to.have.property('ingredient_id', deliveryData.ingredientId);
      expect(response.body).to.have.property('quantity', deliveryData.quantity);
      expect(response.body).to.have.property('type', 'delivery');
    });
  });
});
