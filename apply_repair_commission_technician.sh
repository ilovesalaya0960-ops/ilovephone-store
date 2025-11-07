#!/bin/bash

# Migration script to add commission and technician fields to repairs table
# Date: 2025-11-07

echo "====================================="
echo "Adding commission and technician fields to repairs table"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database credentials (modify if needed)
DB_USER="root"
DB_PASS=""
DB_NAME="ilovephone_db"

# Migration file
MIGRATION_FILE="server/migrations/add_repair_commission_technician.sql"

echo -e "${YELLOW}Step 1: Checking if migration file exists...${NC}"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}Error: Migration file not found at $MIGRATION_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Migration file found${NC}"

echo ""
echo -e "${YELLOW}Step 2: Applying migration to database...${NC}"
if [ -z "$DB_PASS" ]; then
    mysql -u "$DB_USER" "$DB_NAME" < "$MIGRATION_FILE"
else
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$MIGRATION_FILE"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migration applied successfully${NC}"
else
    echo -e "${RED}✗ Error applying migration${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Verifying changes...${NC}"
if [ -z "$DB_PASS" ]; then
    mysql -u "$DB_USER" "$DB_NAME" -e "SHOW COLUMNS FROM repairs LIKE 'commission';" | grep -q "commission"
else
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW COLUMNS FROM repairs LIKE 'commission';" | grep -q "commission"
fi
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ commission column added${NC}"
else
    echo -e "${RED}✗ commission column not found${NC}"
fi

if [ -z "$DB_PASS" ]; then
    mysql -u "$DB_USER" "$DB_NAME" -e "SHOW COLUMNS FROM repairs LIKE 'technician';" | grep -q "technician"
else
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW COLUMNS FROM repairs LIKE 'technician';" | grep -q "technician"
fi
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ technician column added${NC}"
else
    echo -e "${RED}✗ technician column not found${NC}"
fi

echo ""
echo "====================================="
echo -e "${GREEN}Migration completed successfully!${NC}"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Restart the server: cd server && npm start"
echo "2. Test the complete repair form with new fields"
echo ""

