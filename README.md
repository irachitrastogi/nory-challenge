# Weird Salads Inventory Management System

A production-ready inventory management system for the Weird Salads restaurant chain. This application allows staff to accept deliveries, sell items, take stock, and pull reports.

## Project Status

This project is currently under development. More details will be added as the implementation progresses.

## Tech Stack

- Node.js, Express, TypeScript
- SQLite with TypeORM
- Testing: Mocha, Chai, Sinon

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd weird-salads-inventory
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Import initial data:
   ```
   npx ts-node src/utils/importData.ts
   ```
   This step is crucial as it populates the database with all the necessary data from the CSV files in the `data/csv` directory.

4. Start the application:
   ```
   npm start
   ```
   The application will be available at http://localhost:3000

### Development Mode

To run the application in development mode with hot reloading:
```
npm run dev
```

## Usage

The application provides the following functionality:

1. **Accept Deliveries**: When a delivery of fresh ingredients arrives, staff can add the quantity of the delivered inventory items.

2. **Sell Items**: When an item on the menu is sold, the ingredients associated with it are automatically removed from inventory. The system prevents selling items for which there are not enough ingredients in stock.

3. **Take Stock**: Staff can count all inventory in the store and compare with the quantities in the system. If there are discrepancies (due to waste or other reasons), they can be recorded.

4. **Pull Reports**: Location managers can view reports showing all inventory movements and summary statistics including:
   - Total cost of all deliveries
   - Total revenue from all sales
   - Total value of current inventory
   - Cost of all recorded waste

## API Endpoints

The application provides the following API endpoints:

- `GET /api/locations`: Get all active locations
- `GET /api/locations/:id`: Get a specific location by ID
- `GET /api/inventory/:locationId`: Get inventory for a specific location
- `POST /api/inventory/delivery`: Accept a delivery of ingredients
- `POST /api/inventory/sale`: Record a sale of a menu item
- `POST /api/inventory/stock`: Take stock and adjust inventory levels
- `GET /api/inventory/report/:locationId`: Get inventory movement report for a location

## Project Structure

- `src/`: Source code
  - `api/`: API routes and controllers
  - `config/`: Configuration files
  - `models/`: Database models
  - `services/`: Business logic
  - `utils/`: Utility functions
  - `index.ts`: Application entry point
- `data/`: Data files
  - `csv/`: CSV files for initial data import
- `public/`: Static files for the web interface
- `tests/`: Test files
