-- Add damage fields to equipment table
ALTER TABLE equipment
ADD COLUMN damage_quantity INT DEFAULT 0,
ADD COLUMN damage_date DATE DEFAULT NULL;

-- Update existing records to have damage_quantity = 0 if NULL
UPDATE equipment SET damage_quantity = 0 WHERE damage_quantity IS NULL;
