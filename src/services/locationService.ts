import { AppDataSource } from "../config/database";
import { Location } from "../models/Location";
import { Staff } from "../models/Staff";

/**
 * Service for managing locations and staff
 */
export class LocationService {
  /**
   * Get all locations
   */
  async getAllLocations(): Promise<Location[]> {
    const locationRepository = AppDataSource.getRepository(Location);
    
    const locations = await locationRepository.find({
      where: {
        active: true
      },
      order: {
        name: "ASC"
      }
    });
    
    return locations;
  }
  
  /**
   * Get location by ID
   */
  async getLocationById(locationId: number): Promise<Location> {
    const locationRepository = AppDataSource.getRepository(Location);
    
    const location = await locationRepository.findOne({
      where: {
        location_id: locationId,
        active: true
      }
    });
    
    if (!location) {
      throw new Error(`Location with ID ${locationId} not found`);
    }
    
    return location;
  }
  
  /**
   * Get all staff for a location
   */
  async getStaffByLocation(locationId: number): Promise<Staff[]> {
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
    
    return staff;
  }
  
  /**
   * Get staff member by ID
   */
  async getStaffById(staffId: number): Promise<Staff> {
    const staffRepository = AppDataSource.getRepository(Staff);
    
    const staff = await staffRepository.findOne({
      where: {
        staff_id: staffId,
        active: true
      },
      relations: ["location"]
    });
    
    if (!staff) {
      throw new Error(`Staff member with ID ${staffId} not found`);
    }
    
    return staff;
  }
}
