import { Router, Request, Response, NextFunction } from 'express';
import { InventoryService } from '../../services/inventoryService';
import { param, query, validationResult } from 'express-validator';

const router = Router();
const inventoryService = new InventoryService();

/**
 * @swagger
 * /api/reports/movements/{locationId}:
 *   get:
 *     summary: Get inventory movements for a location
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering movements (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering movements (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [delivery, sale, waste, adjustment]
 *         description: Type of movement to filter by
 *     responses:
 *       200:
 *         description: List of inventory movements
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
router.get('/movements/:locationId', [
  param('locationId').isInt().withMessage('Location ID must be an integer'),
  query('startDate').optional().isDate().withMessage('Start date must be a valid date'),
  query('endDate').optional().isDate().withMessage('End date must be a valid date'),
  query('type').optional().isIn(['delivery', 'sale', 'waste', 'adjustment']).withMessage('Type must be a valid movement type')
], async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const locationId = parseInt(req.params.locationId);
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const movementType = req.query.type as any;

    const movements = await inventoryService.getInventoryMovements({
      locationId,
      startDate,
      endDate,
      movementType
    });

    res.status(200).json(movements);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reports/summary/{locationId}:
 *   get:
 *     summary: Get inventory report summary for a location
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering movements (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering movements (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Report summary
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
router.get('/summary/:locationId', [
  param('locationId').isInt().withMessage('Location ID must be an integer'),
  query('startDate').optional().isDate().withMessage('Start date must be a valid date'),
  query('endDate').optional().isDate().withMessage('End date must be a valid date')
], async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const locationId = parseInt(req.params.locationId);
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const summary = await inventoryService.getReportSummary({
      locationId,
      startDate,
      endDate
    });

    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;
