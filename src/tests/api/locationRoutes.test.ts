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

    it('should return 400 for invalid location ID format', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/api/locations/invalid')
        .expect(400);
      
      // Verify error response format
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.have.property('code', 'BAD_REQUEST');
      expect(response.body.error.message).to.include('Invalid location ID');
    });

    it('should return 404 for negative location ID', async () => {
      // Act & Assert
      await request(app)
        .get('/api/locations/-1')
        .expect(404);
    });
  });

  describe('GET /api/locations/:locationId/staff', () => {
    it('should return staff for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const response = await request(app)
        .get(`/api/locations/${locationId}/staff`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0]).to.have.property('staff_id');
      expect(response.body[0]).to.have.property('location_id', locationId);
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('role');
    });

    it('should return 404 if location does not exist', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act & Assert
      await request(app)
        .get(`/api/locations/${nonExistentLocationId}/staff`)
        .expect(404);
    });

    it('should return 400 for invalid location ID format', async () => {
      // Act & Assert
      const response = await request(app)
        .get('/api/locations/invalid/staff')
        .expect(400);
      
      // Verify error response format
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.have.property('code', 'BAD_REQUEST');
      expect(response.body.error.message).to.include('Invalid location ID');
    });

    it('should return empty array for location with no staff', async () => {
      // First, let's create a test location that exists but has no staff
      const locationId = 1;
      
      // Clear database
      await clearTestDatabase();
      
      // Create a custom repository to add just the location without staff
      const AppDataSource = require('../../config/database').AppDataSource;
      const Location = require('../../models/Location').Location;
      
      // Create a location without any staff
      const locationRepository = AppDataSource.getRepository(Location);
      await locationRepository.save({
        location_id: locationId,
        name: 'Test Location',
        address: '123 Test St',
        phone: '555-1234',
        email: 'test@example.com',
        active: true
      });
      
      // Act
      const response = await request(app)
        .get(`/api/locations/${locationId}/staff`)
        .expect(200);
      
      // Assert
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(0);
    });
  });
});
