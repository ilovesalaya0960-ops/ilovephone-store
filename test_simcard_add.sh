#!/bin/bash

# Test adding a simcard with expiry_date
echo "🧪 Testing Simcard Creation with Expiry Date..."
echo "=============================================="

# Test data
SIMCARD_ID="SIM-TEST-$(date +%s)"
PROVIDER="AIS"
PHONE_NUMBER="081-234-5678"
PACKAGE="-"
COST_PRICE="0"
SALE_PRICE="0"
IMPORT_DATE="2024-11-26"
EXPIRY_DATE="2025-11-26"
STATUS="available"
STORE="salaya"

echo "📝 Creating simcard with following data:"
echo "  ID: $SIMCARD_ID"
echo "  Provider: $PROVIDER"
echo "  Phone Number: $PHONE_NUMBER"
echo "  Import Date: $IMPORT_DATE"
echo "  Expiry Date: $EXPIRY_DATE"
echo ""

# Create simcard
RESPONSE=$(curl -s -X POST http://localhost:5001/api/simcard \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"$SIMCARD_ID\",
    \"provider\": \"$PROVIDER\",
    \"phone_number\": \"$PHONE_NUMBER\",
    \"package\": \"$PACKAGE\",
    \"cost_price\": $COST_PRICE,
    \"sale_price\": $SALE_PRICE,
    \"import_date\": \"$IMPORT_DATE\",
    \"expiry_date\": \"$EXPIRY_DATE\",
    \"status\": \"$STATUS\",
    \"store\": \"$STORE\"
  }")

echo "✅ Response: $RESPONSE"
echo ""

# Verify the simcard was created
echo "🔍 Verifying simcard was created..."
VERIFY=$(curl -s http://localhost:5001/api/simcard/$SIMCARD_ID)
echo "✅ Simcard Data: $VERIFY"
echo ""

# Check if expiry_date is present
if echo "$VERIFY" | grep -q "expiry_date"; then
    echo "✅ SUCCESS: expiry_date field is present!"

    # Extract expiry_date value
    EXPIRY_VALUE=$(echo "$VERIFY" | grep -o '"expiry_date":"[^"]*"' | cut -d'"' -f4)
    echo "   Expiry Date Value: $EXPIRY_VALUE"
else
    echo "❌ ERROR: expiry_date field is missing!"
fi

echo ""
echo "=============================================="
echo "✅ Test completed!"
