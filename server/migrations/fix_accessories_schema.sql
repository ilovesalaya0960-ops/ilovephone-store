-- Migration: Fix accessories table schema to match API and Frontend
-- Date: 2025-11-06
-- Description: 
--   1. Add repair_price field (used by API/Frontend)
--   2. Add store column (VARCHAR) for API compatibility
--   3. Migrate data from store_id to store

-- Note: Change database name if needed (mobile_shop_db or ilovephone_db)
USE mobile_shop_db;

-- Step 1: Add repair_price column
-- Check if column exists first (MySQL 5.7+)
SET @dbname = DATABASE();
SET @tablename = 'accessories';
SET @columnname = 'repair_price';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10,2) DEFAULT 0 AFTER cost_price')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Add store column (VARCHAR) for API compatibility
SET @columnname = 'store';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(50) AFTER store_id')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 3: Migrate data from store_id to store (if store_id exists and store is empty)
-- Use store ID (e.g., 'salaya', 'klongyong') instead of store name
UPDATE accessories
SET store = store_id
WHERE (store IS NULL OR store = '') AND store_id IS NOT NULL;

-- Step 4: Add index for store column (if not exists)
SET @indexname = 'idx_store';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (INDEX_NAME = @indexname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD INDEX ', @indexname, ' (store)')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verification queries (run these to check):
-- SELECT id, store_id, store, cost_price, repair_price, sale_price FROM accessories LIMIT 5;

