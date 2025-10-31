#!/bin/bash
# Apply all migrations to the database

echo "======================================="
echo "Applying Database Migrations"
echo "======================================="

# Check if database name is provided
DB_NAME=${1:-mobile_shop_db}
DB_USER=${2:-root}

echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Migration 1: Add purchased_from field
echo "1. Adding 'purchased_from' field..."
mysql -u $DB_USER -p $DB_NAME < server/migrations/add_purchased_from_field.sql
if [ $? -eq 0 ]; then
    echo "   ✅ Success: purchased_from field added"
else
    echo "   ⚠️  Warning: purchased_from field may already exist or migration failed"
fi
echo ""

# Migration 2: Add device_category field
echo "2. Adding 'device_category' field..."
mysql -u $DB_USER -p $DB_NAME < server/migrations/add_device_category_field.sql
if [ $? -eq 0 ]; then
    echo "   ✅ Success: device_category field added"
else
    echo "   ⚠️  Warning: device_category field may already exist or migration failed"
fi
echo ""

echo "======================================="
echo "Migration Complete!"
echo "======================================="
echo ""
echo "New fields added:"
echo "  - purchased_from (VARCHAR)"
echo "  - device_category (ENUM: 'No Active', 'Active')"
echo ""
echo "You can now restart your server and test the new features."

