import { expect } from 'chai';
import { LocationService } from '../../services/locationService';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData } from '../testHelpers';

describe('Location Service Functions', () => {
  let locationService: LocationService;

  before(async () => {
    // Set up test database
    await setupTestDatabase();
    locationService = new LocationService();
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

  describe('getAllLocations', () => {
    it('should return all active locations', async () => {
      // Act
      const locations = await locationService.getAllLocations();
      
      // Assert
      expect(locations).to.be.an('array');
      expect(locations.length).to.be.greaterThan(0);
      expect(locations[0]).to.have.property('location_id');
      expect(locations[0]).to.have.property('name');
      expect(locations[0]).to.have.property('active', true);
    });
  });

  describe('getLocationById', () => {
    it('should return a specific location by ID', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const location = await locationService.getLocationById(locationId);
      
      // Assert
      expect(location).to.be.an('object');
      expect(location.location_id).to.equal(locationId);
      expect(location).to.have.property('name');
      expect(location).to.have.property('address');
      expect(location).to.have.property('active', true);
    });

    it('should throw an error if location does not exist', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act & Assert
      try {
        await locationService.getLocationById(nonExistentLocationId);
        expect.fail('Expected an error to be thrown');
      } catch (error: any) {
        expect(error).to.be.an('Error');
        expect(error.message).to.include(`Location with ID ${nonExistentLocationId} not found`);
      }
    });
  });

  describe('getStaffByLocation', () => {
    it('should return all staff for a location', async () => {
      // Arrange
      const locationId = 1;
      
      // Act
      const staff = await locationService.getStaffByLocation(locationId);
      
      // Assert
      expect(staff).to.be.an('array');
      expect(staff.length).to.be.greaterThan(0);
      expect(staff[0]).to.have.property('staff_id');
      expect(staff[0]).to.have.property('location_id', locationId);
      expect(staff[0]).to.have.property('name');
      expect(staff[0]).to.have.property('role');
      expect(staff[0]).to.have.property('active', true);
    });

    it('should return empty array if no staff found for location', async () => {
      // Arrange
      const nonExistentLocationId = 999;
      
      // Act
      const staff = await locationService.getStaffByLocation(nonExistentLocationId);
      
      // Assert
      expect(staff).to.be.an('array');
      expect(staff.length).to.equal(0);
    });
  });

  describe('getStaffById', () => {
    it('should return a specific staff member by ID', async () => {
      // Arrange
      const staffId = 1;
      
      // Act
      const staff = await locationService.getStaffById(staffId);
      
      // Assert
      expect(staff).to.be.an('object');
      expect(staff.staff_id).to.equal(staffId);
      expect(staff).to.have.property('name');
      expect(staff).to.have.property('location_id');
      expect(staff).to.have.property('role');
      expect(staff).to.have.property('active', true);
    });

    it('should throw an error if staff member does not exist', async () => {
      // Arrange
      const nonExistentStaffId = 999;
      
      // Act & Assert
      try {
        await locationService.getStaffById(nonExistentStaffId);
        expect.fail('Expected an error to be thrown');
      } catch (error: any) {
        expect(error).to.be.an('Error');
        expect(error.message).to.include(`Staff member with ID ${nonExistentStaffId} not found`);
      }
    });
  });
});
