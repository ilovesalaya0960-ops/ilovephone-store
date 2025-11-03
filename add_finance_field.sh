#!/bin/bash

echo "🔧 Adding finance field to installments table..."

# Run the migration
mysql -u root ilovephone_store < server/migrations/add_finance_field.sql

if [ $? -eq 0 ]; then
    echo "✅ Finance field added successfully!"
    echo ""
    echo "📋 Summary:"
    echo "   - Added 'finance' column to installments table"
    echo "   - Type: VARCHAR(255)"
    echo "   - Position: After 'note' column"
else
    echo "❌ Failed to add finance field"
    exit 1
fi

