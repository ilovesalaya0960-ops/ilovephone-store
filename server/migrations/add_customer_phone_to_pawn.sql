-- Migration: Add customer_phone column to pawn_devices table
-- Date: 2025-12-06
-- Description: Add phone number field for pawn customers

-- Add customer_phone column if it doesn't exist
ALTER TABLE pawn_devices
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20) DEFAULT '' AFTER customer_name;

-- If the above syntax doesn't work (for older MySQL versions), use this alternative:
-- SET @columnExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pawn_devices' AND COLUMN_NAME = 'customer_phone' AND TABLE_SCHEMA = DATABASE());
-- SET @sql = IF(@columnExists = 0, 'ALTER TABLE pawn_devices ADD COLUMN customer_phone VARCHAR(20) DEFAULT "" AFTER customer_name', 'SELECT "Column already exists"');
-- PREPARE stmt FROM @sql;
-- EXECUTE stmt;
-- DEALLOCATE PREPARE stmt;

