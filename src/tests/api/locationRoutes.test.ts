import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../app';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData } from '../testHelpers';

describe('Location API Routes', () => {
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

  describe('GET /api/locations', () => {
    it('should return all active locations', async () => {
      // Act
      const response = await request(app)
        .get('/api/locations')
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0]).to.have.property('location_id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('active', true);
    });
  });

  describe('GET /api/locations/:locationId', () => {
    it('should return a specific location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/locations/${locationId}`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('object');
      expect(response.body.location_id).to.equal(locationId);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('address');
      expect(response.body).to.have.property('active');
    });

    it('should return 404 if location does not exist', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act & Assert
      await request(app)
        .get(`/api/locations/${nonExistentLocationId}`)
        .expect(404);
    });
  });
});
