-- =====================================================
-- Add new fields to used_devices table
-- Fields: purchased_from, device_category
-- Also fixes column name inconsistencies
-- =====================================================

USE mobile_shop_db;

-- Check and rename store_id to store if exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'store_id'
);

SET @sql = IF(@column_exists = 1,
    'ALTER TABLE used_devices CHANGE store_id store VARCHAR(50) NOT NULL;',
    'SELECT "store column already correct" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and rename condition_status to device_condition if exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'condition_status'
);

SET @sql = IF(@column_exists = 1,
    'ALTER TABLE used_devices CHANGE condition_status device_condition VARCHAR(50);',
    'SELECT "device_condition column already correct" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and rename purchase_date to import_date if exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'purchase_date'
);

SET @sql = IF(@column_exists = 1,
    'ALTER TABLE used_devices CHANGE purchase_date import_date DATE NOT NULL;',
    'SELECT "import_date column already correct" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add purchased_from field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'purchased_from'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE used_devices ADD COLUMN purchased_from VARCHAR(100) AFTER rom;',
    'SELECT "purchased_from column already exists" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add device_category field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'device_category'
);

SET @sql = IF(@column_exists = 0,
    "ALTER TABLE used_devices ADD COLUMN device_category ENUM('No Active', 'Active') DEFAULT 'No Active' AFTER purchased_from;",
    'SELECT "device_category column already exists" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to have default value for device_category
UPDATE used_devices 
SET device_category = 'No Active' 
WHERE device_category IS NULL;

-- Display final table structure
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'mobile_shop_db'
AND TABLE_NAME = 'used_devices'
ORDER BY ORDINAL_POSITION;

SELECT '✅ Migration completed successfully!' AS status;

