import { Router, Request, Response, NextFunction } from 'express';
import { InventoryService } from '../../services/inventoryService';
import { param } from 'express-validator';

const router = Router();
const inventoryService = new InventoryService();

/**
 * @swagger
 * /api/menu/{locationId}:
 *   get:
 *     summary: Get menu items for a location
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: List of menu items
 *       500:
 *         description: Server error
 */
router.get('/:locationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const menuItems = await inventoryService.getMenuItems(locationId);
    res.status(200).json(menuItems);
  } catch (error) {
    next(error);
  }
});

export default router;
