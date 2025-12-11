-- Migration: Add accessories_used field to repairs table
-- Description: Store JSON data of accessories used for each repair (for claim return stock functionality)

USE ilovephone_db;

-- Add accessories_used column to store JSON data
ALTER TABLE repairs 
ADD COLUMN IF NOT EXISTS accessories_used TEXT NULL AFTER note
COMMENT 'JSON array of accessories used in repair: [{code, name, type, cost}]';

-- Verification query
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'repairs' 
  AND COLUMN_NAME = 'accessories_used';
