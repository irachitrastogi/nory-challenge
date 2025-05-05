const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve mock API data
app.get('/api/locations', (req, res) => {
  res.json([
    { location_id: 1, name: "Downtown" },
    { location_id: 2, name: "Uptown" },
    { location_id: 3, name: "Westside" }
  ]);
});

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

app.get('/api/reports/summary/:locationId', (req, res) => {
  const summary = {
    totalDeliveryCost: 49.00,
    totalSalesRevenue: 4.50,
    totalWasteCost: 4.50,
    totalInventoryValue: 120.75
  };
  
  res.json(summary);
});

// POST endpoints
app.use(express.json());

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
});
