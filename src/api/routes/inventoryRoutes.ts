import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { InventoryService } from '../../services/inventoryService';

const router = Router();
const inventoryService = new InventoryService();

/**
 * @swagger
 * /api/inventory/{locationId}:
 *   get:
 *     summary: Get current inventory for a location
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Current inventory items
 *       500:
 *         description: Server error
 */
router.get('/:locationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const inventory = await inventoryService.getCurrentInventory(locationId);
    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/inventory/delivery:
 *   post:
 *     summary: Accept a delivery
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - staffId
 *               - ingredientId
 *               - quantity
 *               - cost
 *             properties:
 *               locationId:
 *                 type: integer
 *               staffId:
 *                 type: integer
 *               ingredientId:
 *                 type: integer
 *               quantity:
 *                 type: number
 *               cost:
 *                 type: number
 *               reference:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Delivery recorded successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/delivery', [
  body('locationId').isInt().withMessage('Location ID must be an integer'),
  body('staffId').isInt().withMessage('Staff ID must be an integer'),
  body('ingredientId').isInt().withMessage('Ingredient ID must be an integer'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be a positive number'),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a non-negative number'),
  body('reference').optional().isString().withMessage('Reference must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movement = await inventoryService.acceptDelivery(req.body);
    res.status(201).json(movement);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/inventory/sale:
 *   post:
 *     summary: Record a sale
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - staffId
 *               - recipeId
 *               - quantity
 *             properties:
 *               locationId:
 *                 type: integer
 *               staffId:
 *                 type: integer
 *               recipeId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 *       400:
 *         description: Invalid input data or insufficient inventory
 *       500:
 *         description: Server error
 */
router.post('/sale', [
  body('locationId').isInt().withMessage('Location ID must be an integer'),
  body('staffId').isInt().withMessage('Staff ID must be an integer'),
  body('recipeId').isInt().withMessage('Recipe ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movements = await inventoryService.sellItem(req.body);
    res.status(201).json(movements);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Not enough inventory')) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/inventory/stock:
 *   post:
 *     summary: Take stock and adjust inventory
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - staffId
 *               - ingredientId
 *               - actualQuantity
 *             properties:
 *               locationId:
 *                 type: integer
 *               staffId:
 *                 type: integer
 *               ingredientId:
 *                 type: integer
 *               actualQuantity:
 *                 type: number
 *                 minimum: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stock adjustment recorded successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/stock', [
  body('locationId').isInt().withMessage('Location ID must be an integer'),
  body('staffId').isInt().withMessage('Staff ID must be an integer'),
  body('ingredientId').isInt().withMessage('Ingredient ID must be an integer'),
  body('actualQuantity').isFloat({ min: 0 }).withMessage('Actual quantity must be a non-negative number'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movement = await inventoryService.takeStock(req.body);
    res.status(201).json(movement);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/inventory/recipe/{recipeId}/ingredients:
 *   get:
 *     summary: Get ingredients for a recipe
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: List of recipe ingredients
 *       500:
 *         description: Server error
 */
router.get('/recipe/:recipeId/ingredients', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const ingredients = await inventoryService.getRecipeIngredients(recipeId);
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
});

export default router;
