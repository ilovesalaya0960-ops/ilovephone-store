-- ===================================
-- Add expiry_date column to simcards table
-- ===================================

USE ilovephone_db;

-- Add expiry_date column
ALTER TABLE simcards
ADD COLUMN expiry_date DATE NULL COMMENT 'วันที่หมดอายุ'
AFTER import_date;

-- Add index for expiry_date
ALTER TABLE simcards
ADD INDEX idx_expiry_date (expiry_date);
