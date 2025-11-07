-- Migration: Add accessory_cost field to repairs table
-- Date: 2025-11-07
-- Description: Add accessory_cost column to track the cost of accessories used in repairs

-- Add accessory_cost column
SET @dbname = DATABASE();
SET @tablename = 'repairs';

-- Add accessory_cost column
SET @columnname = 'accessory_cost';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10,2) DEFAULT 0 AFTER commission')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verification query
-- SELECT id, brand, model, repair_cost, accessory_cost, commission FROM repairs LIMIT 5;

