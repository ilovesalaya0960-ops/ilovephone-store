-- Migration: Add commission and technician fields to repairs table
-- Date: 2025-11-07
-- Description: Add commission (ค่าคอม) and technician (คนซ่อม) columns to repairs table

-- Add commission column
SET @dbname = DATABASE();
SET @tablename = 'repairs';

-- Add commission column
SET @columnname = 'commission';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10,2) DEFAULT 0 AFTER repair_cost')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add technician column
SET @columnname = 'technician';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(100) AFTER commission')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verification query
-- SELECT id, brand, model, repair_cost, commission, technician FROM repairs LIMIT 5;

