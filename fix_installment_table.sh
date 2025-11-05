#!/bin/bash

echo "🔧 Fixing installment_devices table..."
echo "========================================"
echo ""

DB_NAME="ilovephone_store"
DB_USER="root"

# Function to add column if not exists
add_column_if_not_exists() {
    local table=$1
    local column=$2
    local definition=$3
    local after=$4
    
    # Check if column exists
    COLUMN_EXISTS=$(mysql -u $DB_USER -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='$table' AND COLUMN_NAME='$column'")
    
    if [ "$COLUMN_EXISTS" -eq "0" ]; then
        echo "  ✅ Adding column: $column"
        if [ -z "$after" ]; then
            mysql -u $DB_USER $DB_NAME -e "ALTER TABLE $table ADD COLUMN $column $definition"
        else
            mysql -u $DB_USER $DB_NAME -e "ALTER TABLE $table ADD COLUMN $column $definition AFTER $after"
        fi
    else
        echo "  ℹ️  Column already exists: $column"
    fi
}

echo "1️⃣ Adding missing columns..."
echo ""

# Add commission
add_column_if_not_exists "installment_devices" "commission" "DECIMAL(10,2) DEFAULT 0" "sale_price"

# Add next_payment_due_date
add_column_if_not_exists "installment_devices" "next_payment_due_date" "DATE" "down_payment_date"

# Add installment_type
add_column_if_not_exists "installment_devices" "installment_type" "ENUM('partner', 'store') DEFAULT 'partner'" "status"

# Add finance
add_column_if_not_exists "installment_devices" "finance" "VARCHAR(255)" "note"

# Add store
add_column_if_not_exists "installment_devices" "store" "VARCHAR(50)" "finance"

echo ""
echo "2️⃣ Updating existing data..."
echo ""

# Update default values
mysql -u $DB_USER $DB_NAME -e "
UPDATE installment_devices 
SET commission = 0 
WHERE commission IS NULL;
"
echo "  ✅ Updated commission defaults"

mysql -u $DB_USER $DB_NAME -e "
UPDATE installment_devices 
SET installment_type = 'partner' 
WHERE installment_type IS NULL OR installment_type = '';
"
echo "  ✅ Updated installment_type defaults"

mysql -u $DB_USER $DB_NAME -e "
UPDATE installment_devices 
SET finance = '' 
WHERE finance IS NULL;
"
echo "  ✅ Updated finance defaults"

mysql -u $DB_USER $DB_NAME -e "
UPDATE installment_devices 
SET store = CASE 
    WHEN store_id = '1' THEN 'salaya'
    WHEN store_id = '2' THEN 'klongyong'
    ELSE COALESCE(store_id, 'salaya')
END
WHERE store IS NULL OR store = '';
"
echo "  ✅ Migrated store_id to store"

echo ""
echo "3️⃣ Creating indexes..."
echo ""

mysql -u $DB_USER $DB_NAME -e "
CREATE INDEX IF NOT EXISTS idx_store ON installment_devices(store);
CREATE INDEX IF NOT EXISTS idx_installment_type ON installment_devices(installment_type);
CREATE INDEX IF NOT EXISTS idx_next_payment_due ON installment_devices(next_payment_due_date);
" 2>/dev/null

echo "  ✅ Indexes created"

echo ""
echo "4️⃣ Verifying table structure..."
echo ""

mysql -u $DB_USER $DB_NAME -e "DESCRIBE installment_devices;" | grep -E "commission|next_payment_due_date|installment_type|finance|store"

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "📋 Summary:"
echo "   - Added: commission"
echo "   - Added: next_payment_due_date"
echo "   - Added: installment_type"
echo "   - Added: finance ✨"
echo "   - Added: store"
echo ""
echo "🎉 You can now use the finance field!"

