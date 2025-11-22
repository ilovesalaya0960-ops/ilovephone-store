-- Add damage fields to accessories table
ALTER TABLE accessories
ADD COLUMN IF NOT EXISTS damage_quantity INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS damage_date DATE DEFAULT NULL;

-- Update existing records to have damage_quantity = 0 if NULL
UPDATE accessories SET damage_quantity = 0 WHERE damage_quantity IS NULL;

