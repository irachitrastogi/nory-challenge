#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Test the locations endpoint
echo "Testing GET /api/locations"
curl -s $BASE_URL/locations | jq

# Test getting a specific location
echo -e "\nTesting GET /api/locations/1"
curl -s $BASE_URL/locations/1 | jq

# Test getting staff for a location
echo -e "\nTesting GET /api/locations/1/staff"
curl -s $BASE_URL/locations/1/staff | jq

# Test getting inventory for a location
echo -e "\nTesting GET /api/inventory/1"
curl -s $BASE_URL/inventory/1 | jq

# Test getting menu items for a location
echo -e "\nTesting GET /api/menu/1"
curl -s $BASE_URL/menu/1 | jq

# Test getting inventory movements for a location
echo -e "\nTesting GET /api/reports/movements/1"
curl -s $BASE_URL/reports/movements/1 | jq

# Test getting report summary for a location
echo -e "\nTesting GET /api/reports/summary/1"
curl -s $BASE_URL/reports/summary/1 | jq

# Test accepting a delivery
echo -e "\nTesting POST /api/inventory/delivery"
curl -s -X POST $BASE_URL/inventory/delivery \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": 1,
    "staffId": 1,
    "ingredientId": 1,
    "quantity": 5,
    "cost": 10
  }' | jq

# Test recording a sale
echo -e "\nTesting POST /api/inventory/sale"
curl -s -X POST $BASE_URL/inventory/sale \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": 1,
    "staffId": 1,
    "menuItemId": 1,
    "quantity": 1
  }' | jq

# Test taking stock
echo -e "\nTesting POST /api/inventory/stock"
curl -s -X POST $BASE_URL/inventory/stock \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": 1,
    "staffId": 1,
    "ingredientId": 1,
    "actualQuantity": 14
  }' | jq
