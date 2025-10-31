-- ==============================================
-- Fix Missing Fields: purchased_from & device_category
-- ==============================================

USE mobile_shop_db;

-- Check and add purchased_from field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'new_devices'
    AND COLUMN_NAME = 'purchased_from'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE new_devices ADD COLUMN purchased_from VARCHAR(100) AFTER rom;',
    'SELECT "purchased_from column already exists" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add device_category field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'new_devices'
    AND COLUMN_NAME = 'device_category'
);

SET @sql = IF(@column_exists = 0,
    "ALTER TABLE new_devices ADD COLUMN device_category ENUM('No Active', 'Active') DEFAULT 'No Active' AFTER purchased_from;",
    'SELECT "device_category column already exists" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to have default value for device_category
UPDATE new_devices 
SET device_category = 'No Active' 
WHERE device_category IS NULL;

-- Display final table structure
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'mobile_shop_db'
AND TABLE_NAME = 'new_devices'
AND COLUMN_NAME IN ('purchased_from', 'device_category', 'ram', 'rom')
ORDER BY ORDINAL_POSITION;

-- Show sample data
SELECT 
    id,
    brand,
    model,
    ram,
    rom,
    purchased_from,
    device_category
FROM new_devices
LIMIT 5;

