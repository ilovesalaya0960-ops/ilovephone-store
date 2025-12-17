-- Add os_type field to pawn_devices table
-- This allows differentiating between iOS and Android devices
-- iOS devices don't require RAM specification

ALTER TABLE pawn_devices 
ADD COLUMN os_type ENUM('ios', 'android') DEFAULT NULL AFTER imei;

-- Update existing records to set os_type based on brand
UPDATE pawn_devices 
SET os_type = 'ios' 
WHERE LOWER(brand) LIKE '%apple%' OR LOWER(brand) LIKE '%iphone%';

UPDATE pawn_devices 
SET os_type = 'android' 
WHERE os_type IS NULL;

