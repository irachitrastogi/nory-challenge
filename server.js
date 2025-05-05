const express = require('express');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weird Salads Inventory API',
      version: '1.0.0',
      description: 'API for Weird Salads Inventory Management System',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'], // Point to this file for API documentation
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 */
app.get('/api/locations', (req, res) => {
  res.json([
    { location_id: 1, name: "Downtown" },
    { location_id: 2, name: "Uptown" },
    { location_id: 3, name: "Westside" }
  ]);
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
 *     responses:
 *       200:
 *         description: List of staff members
 */
app.get('/api/locations/:id/staff', (req, res) => {
  const locationId = parseInt(req.params.id);
  const staffMembers = [
    { staff_id: 1, name: "John Doe", location_id: 1 },
    { staff_id: 2, name: "Jane Smith", location_id: 1 },
    { staff_id: 3, name: "Bob Johnson", location_id: 1 },
    { staff_id: 4, name: "Alice Brown", location_id: 2 },
    { staff_id: 5, name: "Charlie Wilson", location_id: 2 },
    { staff_id: 6, name: "Diana Miller", location_id: 2 },
    { staff_id: 7, name: "Edward Davis", location_id: 3 },
    { staff_id: 8, name: "Fiona Clark", location_id: 3 },
    { staff_id: 9, name: "George White", location_id: 3 }
  ].filter(staff => staff.location_id === locationId);
  
  res.json(staffMembers);
});

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
 *     responses:
 *       200:
 *         description: List of inventory items
 */
app.get('/api/inventory/:locationId', (req, res) => {
  const inventory = [
    { inventory_id: 1, ingredient: { name: "Lettuce", cost: 2.50 }, quantity: 10, unit: "kg" },
    { inventory_id: 2, ingredient: { name: "Tomato", cost: 3.00 }, quantity: 8, unit: "kg" },
    { inventory_id: 3, ingredient: { name: "Cucumber", cost: 1.75 }, quantity: 6, unit: "kg" },
    { inventory_id: 4, ingredient: { name: "Carrot", cost: 1.50 }, quantity: 7, unit: "kg" },
    { inventory_id: 5, ingredient: { name: "Chicken", cost: 5.00 }, quantity: 12, unit: "kg" }
  ];
  
  res.json(inventory);
});

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
 *     responses:
 *       200:
 *         description: List of menu items
 */
app.get('/api/menu/:locationId', (req, res) => {
  const menuItems = [
    { menu_item_id: 1, name: "Classic Caesar Salad", price: 8.99 },
    { menu_item_id: 2, name: "Greek Salad", price: 9.99 },
    { menu_item_id: 3, name: "Chicken Quinoa Bowl", price: 11.99 },
    { menu_item_id: 4, name: "Avocado Spinach Salad", price: 10.99 },
    { menu_item_id: 5, name: "Tofu Veggie Salad", price: 10.99 }
  ];
  
  res.json(menuItems);
});

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
 *     responses:
 *       200:
 *         description: List of inventory movements
 */
app.get('/api/reports/movements/:locationId', (req, res) => {
  const movements = [
    { movement_id: 1, ingredient: { name: "Lettuce" }, staff: { name: "John Doe" }, quantity: 10, type: "delivery", cost: 25.00, revenue: null, timestamp: "2025-05-01T10:00:00" },
    { movement_id: 2, ingredient: { name: "Tomato" }, staff: { name: "John Doe" }, quantity: 8, type: "delivery", cost: 24.00, revenue: null, timestamp: "2025-05-01T10:15:00" },
    { movement_id: 3, ingredient: { name: "Lettuce" }, staff: { name: "Jane Smith" }, quantity: -0.2, type: "sale", cost: null, revenue: 2.25, timestamp: "2025-05-02T12:30:00" },
    { movement_id: 4, ingredient: { name: "Chicken" }, staff: { name: "Jane Smith" }, quantity: -0.15, type: "sale", cost: null, revenue: 2.25, timestamp: "2025-05-02T12:30:00" },
    { movement_id: 5, ingredient: { name: "Tomato" }, staff: { name: "Bob Johnson" }, quantity: -1.5, type: "waste", cost: 4.50, revenue: null, timestamp: "2025-05-03T18:00:00" }
  ];
  
  res.json(movements);
});

/**
 * @swagger
 * /api/reports/summary/{locationId}:
 *   get:
 *     summary: Get inventory summary for a location
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventory summary
 */
app.get('/api/reports/summary/:locationId', (req, res) => {
  const summary = {
    totalDeliveryCost: 49.00,
    totalSalesRevenue: 4.50,
    totalWasteCost: 4.50,
    totalInventoryValue: 120.75
  };
  
  res.json(summary);
});

/**
 * @swagger
 * /api/inventory/delivery:
 *   post:
 *     summary: Accept a delivery of ingredients
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
 *       200:
 *         description: Delivery recorded successfully
 */
app.post('/api/inventory/delivery', (req, res) => {
  // In a real app, this would save to the database
  console.log('Delivery received:', req.body);
  res.json({
    success: true,
    message: 'Delivery recorded successfully',
    data: {
      movement_id: Math.floor(Math.random() * 1000),
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * @swagger
 * /api/inventory/sale:
 *   post:
 *     summary: Record a sale of a menu item
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
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sale recorded successfully
 */
app.post('/api/inventory/sale', (req, res) => {
  // In a real app, this would save to the database
  console.log('Sale received:', req.body);
  res.json({
    success: true,
    message: 'Sale recorded successfully',
    data: {
      movement_id: Math.floor(Math.random() * 1000),
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
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
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock adjustment recorded successfully
 */
app.post('/api/inventory/stock', (req, res) => {
  // In a real app, this would save to the database
  console.log('Stock adjustment received:', req.body);
  res.json({
    success: true,
    message: 'Stock adjustment recorded successfully',
    data: {
      movement_id: Math.floor(Math.random() * 1000),
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
