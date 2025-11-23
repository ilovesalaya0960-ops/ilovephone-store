-- Add damage_quantity and damage_date columns to equipment table
-- Run this migration if these columns don't exist yet

ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS damage_quantity INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS damage_date DATE DEFAULT NULL;

-- Update existing records to have default values
UPDATE equipment 
SET damage_quantity = 0 
WHERE damage_quantity IS NULL;

