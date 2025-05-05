import { AppDataSource } from "../config/database";
import { Location } from "../models/Location";
import { Staff } from "../models/Staff";
import { NotFoundError, DatabaseError } from "../errors/AppError";
import { logger } from "../utils/logger";

/**
 * Service for managing locations and staff
 */
export class LocationService {
  /**
   * Get all locations
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      const locationRepository = AppDataSource.getRepository(Location);
      
      const locations = await locationRepository.find({
        where: {
          active: true
        },
        order: {
          name: "ASC"
        }
      });
      
      logger.info(`Retrieved ${locations.length} locations`);
      return locations;
    } catch (error) {
      logger.error('Failed to get all locations', { error });
      throw new DatabaseError('Failed to retrieve locations');
    }
  }
  
  /**
   * Get location by ID
   */
  async getLocationById(locationId: number): Promise<Location> {
    try {
      const locationRepository = AppDataSource.getRepository(Location);
      
      const location = await locationRepository.findOne({
        where: {
          location_id: locationId,
          active: true
        }
      });
      
      if (!location) {
        logger.warn(`Location with ID ${locationId} not found`);
        throw new NotFoundError(`Location with ID ${locationId} not found`);
      }
      
      logger.info(`Retrieved location with ID ${locationId}`);
      return location;
    } catch (error) {
      // If it's already our custom error, just rethrow it
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      logger.error(`Failed to get location with ID ${locationId}`, { error });
      throw new DatabaseError(`Failed to retrieve location with ID ${locationId}`);
    }
  }
  
  /**
   * Get all staff for a location
   */
  async getStaffByLocation(locationId: number): Promise<Staff[]> {
    try {
      const staffRepository = AppDataSource.getRepository(Staff);
      
      const staff = await staffRepository.find({
        where: {
          location_id: locationId,
          active: true
        },
        order: {
          name: "ASC"
        }
      });
      
      logger.info(`Retrieved ${staff.length} staff members for location ${locationId}`);
      return staff;
    } catch (error) {
      logger.error(`Failed to get staff for location ${locationId}`, { error });
      throw new DatabaseError(`Failed to retrieve staff for location ${locationId}`);
    }
  }
  
  /**
   * Get staff member by ID
   */
  async getStaffById(staffId: number): Promise<Staff> {
    try {
      const staffRepository = AppDataSource.getRepository(Staff);
      
      const staff = await staffRepository.findOne({
        where: {
          staff_id: staffId,
          active: true
        },
        relations: ["location"]
      });
      
      if (!staff) {
        logger.warn(`Staff member with ID ${staffId} not found`);
        throw new NotFoundError(`Staff member with ID ${staffId} not found`);
      }
      
      logger.info(`Retrieved staff member with ID ${staffId}`);
      return staff;
    } catch (error) {
      // If it's already our custom error, just rethrow it
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      logger.error(`Failed to get staff member with ID ${staffId}`, { error });
      throw new DatabaseError(`Failed to retrieve staff member with ID ${staffId}`);
    }
  }
}
