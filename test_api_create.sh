#!/bin/bash

echo "=== Test API Create Accessory at Salaya ==="
echo ""

# Test creating a new accessory at salaya
echo "Creating test accessory..."
curl -X POST http://localhost:5001/api/accessories \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TESTAPI123",
    "type": "battery",
    "code": "TEST-CODE-123",
    "brand": "Samsung",
    "models": "Test Model",
    "quantity": 10,
    "cost_price": 100,
    "repair_price": 200,
    "import_date": "2025-11-16",
    "note": "Test API",
    "store": "salaya"
  }' 2>&1

echo ""
echo ""
echo "=== Verifying in database ==="
mysql -u root ilovephone_db -e "SELECT id, code, brand, models, store, quantity FROM accessories WHERE id = 'TESTAPI123';"

echo ""
echo "=== Cleaning up ==="
mysql -u root ilovephone_db -e "DELETE FROM accessories WHERE id = 'TESTAPI123';"

echo "Done!"
