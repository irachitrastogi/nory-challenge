import { Router, Request, Response, NextFunction } from 'express';
import { LocationService } from '../../services/locationService';
import { asyncHandler } from '../../utils/asyncHandler';
import { BadRequestError } from '../../errors/AppError';

const router = Router();
const locationService = new LocationService();

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all active locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 *       500:
 *         description: Server error
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const locations = await locationService.getAllLocations();
  res.status(200).json(locations);
}));

/**
 * @swagger
 * /api/locations/{locationId}:
 *   get:
 *     summary: Get location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location details
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get('/:locationId', asyncHandler(async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.locationId);
  
  if (isNaN(locationId)) {
    throw new BadRequestError('Invalid location ID');
  }
  
  const location = await locationService.getLocationById(locationId);
  res.status(200).json(location);
}));

/**
 * @swagger
 * /api/locations/{locationId}/staff:
 *   get:
 *     summary: Get staff for a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: List of staff members
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get('/:locationId/staff', asyncHandler(async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.locationId);
  
  if (isNaN(locationId)) {
    throw new BadRequestError('Invalid location ID');
  }
  
  // Verify the location exists
  await locationService.getLocationById(locationId);
  
  // Get staff for the location
  const staff = await locationService.getStaffByLocation(locationId);
  res.status(200).json(staff);
}));

export default router;
