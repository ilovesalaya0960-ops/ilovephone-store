#!/bin/bash
# Apply purchased_from field migration to database

echo "Applying purchased_from field migration..."

# Run the migration SQL file
mysql -u root -p mobile_shop_db < server/migrations/add_purchased_from_field.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration applied successfully!"
    echo "The 'purchased_from' field has been added to the new_devices table."
else
    echo "❌ Migration failed. Please check your database connection and credentials."
fi

