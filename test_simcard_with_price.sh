#!/bin/bash

# Test adding a simcard with all fields including price
echo "🧪 Testing Simcard Creation with Price Fields..."
echo "=============================================="

# Test data
SIMCARD_ID="SIM-PRICE-$(date +%s)"
PROVIDER="TRUE"
PHONE_NUMBER="089-999-8888"
PACKAGE="-"
COST_PRICE="50"
SALE_PRICE="99"
IMPORT_DATE="2024-11-26"
EXPIRY_DATE="2025-11-26"
STATUS="available"
STORE="salaya"

echo "📝 Creating simcard with following data:"
echo "  ID: $SIMCARD_ID"
echo "  Provider: $PROVIDER"
echo "  Phone Number: $PHONE_NUMBER"
echo "  Cost Price: $COST_PRICE ฿"
echo "  Sale Price: $SALE_PRICE ฿"
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

# Check fields
echo "🔍 Checking fields..."
if echo "$VERIFY" | grep -q "\"cost_price\":\"$COST_PRICE"; then
    echo "✅ Cost Price: OK ($COST_PRICE ฿)"
else
    echo "❌ Cost Price: FAILED"
fi

if echo "$VERIFY" | grep -q "\"sale_price\":\"$SALE_PRICE"; then
    echo "✅ Sale Price: OK ($SALE_PRICE ฿)"
else
    echo "❌ Sale Price: FAILED"
fi

if echo "$VERIFY" | grep -q "\"expiry_date\":\"$EXPIRY_DATE\""; then
    echo "✅ Expiry Date: OK ($EXPIRY_DATE)"
else
    echo "❌ Expiry Date: FAILED"
fi

echo ""
echo "=============================================="
echo "✅ Test completed!"
