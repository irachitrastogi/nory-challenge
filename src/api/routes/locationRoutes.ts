import { Router, Request, Response, NextFunction } from 'express';
import { LocationService } from '../../services/locationService';

const router = Router();
const locationService = new LocationService();

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of all active locations
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await locationService.getAllLocations();
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
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
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locationId = parseInt(req.params.id);
    const location = await locationService.getLocationById(locationId);
    res.status(200).json(location);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/locations/{id}/staff:
 *   get:
 *     summary: Get staff for a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: List of staff at the location
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get('/:id/staff', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locationId = parseInt(req.params.id);
    const staff = await locationService.getStaffByLocation(locationId);
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
});

export default router;
