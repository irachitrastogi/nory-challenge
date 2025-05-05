import { expect } from 'chai';
import { InventoryService } from '../../services/inventoryService';
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../setup';
import { seedTestData, createDeliveryData } from '../testHelpers';

describe('InventoryService', () => {
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

  describe('acceptDelivery', () => {
    it('should accept a delivery and update inventory', async () => {
      // Arrange
      const deliveryData = createDeliveryData();
      
      // Act
      const result = await inventoryService.acceptDelivery(deliveryData);
      
      // Assert
      expect(result).to.not.be.null;
      expect(result.location_id).to.equal(deliveryData.locationId);
      expect(result.ingredient_id).to.equal(deliveryData.ingredientId);
      expect(result.quantity).to.equal(deliveryData.quantity);
      expect(result.type).to.equal('delivery');
    });
  });
});
