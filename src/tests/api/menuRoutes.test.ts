import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData } from '../testHelpers';

describe('Menu API Routes', () => {
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

  describe('GET /api/menu/:locationId', () => {
    it('should return all menu items for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/menu/${locationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0]).to.have.property('menu_item_id');
      expect(response.body[0]).to.have.property('location_id', locationId);
      expect(response.body[0]).to.have.property('recipe_id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('price');
    });

    it('should return empty array for non-existent location', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act
      const response = await request(app)
        .get(`/api/menu/${nonExistentLocationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(0);
    });
  });
});
