#!/bin/bash

# Add lock_system_fee field to installment_devices table

echo "🔧 Adding lock_system_fee column to installment_devices table..."

# Run the migration
mysql -u root ilovephone_store < server/migrations/add_lock_system_fee.sql

if [ $? -eq 0 ]; then
    echo "✅ Successfully added lock_system_fee column!"
    echo ""
    echo "📊 Verifying column:"
    mysql -u root ilovephone_store -e "DESCRIBE installment_devices;" | grep lock_system_fee
    echo ""
    echo "✅ Migration complete!"
else
    echo "❌ Error adding lock_system_fee column!"
    exit 1
fi

