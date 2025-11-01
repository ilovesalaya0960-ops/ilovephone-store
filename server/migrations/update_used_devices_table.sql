-- ==============================================
-- Update used_devices table to match new_devices structure
-- เพิ่มฟิลด์ใหม่ให้เหมือนเครื่องใหม่
-- ==============================================

USE mobile_shop_db;

-- Check and add purchased_from field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'purchased_from'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE used_devices ADD COLUMN purchased_from VARCHAR(100) AFTER rom;',
    'SELECT "purchased_from column already exists in used_devices" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add device_category field
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'device_category'
);

SET @sql = IF(@column_exists = 0,
    "ALTER TABLE used_devices ADD COLUMN device_category ENUM('No Active', 'Active') DEFAULT 'No Active' AFTER purchased_from;",
    'SELECT "device_category column already exists in used_devices" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add device_condition field (specific to used devices)
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'device_condition'
);

SET @sql = IF(@column_exists = 0,
    "ALTER TABLE used_devices ADD COLUMN device_condition VARCHAR(50) AFTER device_category;",
    'SELECT "device_condition column already exists in used_devices" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename purchase_date to import_date for consistency
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'mobile_shop_db'
    AND TABLE_NAME = 'used_devices'
    AND COLUMN_NAME = 'purchase_date'
);

SET @sql = IF(@column_exists = 1,
    'ALTER TABLE used_devices CHANGE purchase_date import_date DATE;',
    'SELECT "Column purchase_date does not exist or already renamed" AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to have default values
UPDATE used_devices 
SET device_category = 'No Active' 
WHERE device_category IS NULL;

UPDATE used_devices 
SET device_condition = 'good' 
WHERE device_condition IS NULL;

-- Display final table structure
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'mobile_shop_db'
AND TABLE_NAME = 'used_devices'
ORDER BY ORDINAL_POSITION;

-- Show sample data
SELECT 
    id,
    brand,
    model,
    ram,
    rom,
    purchased_from,
    device_category,
    device_condition,
    status
FROM used_devices
LIMIT 5;

SELECT '✅ Migration completed for used_devices table!' AS result;

