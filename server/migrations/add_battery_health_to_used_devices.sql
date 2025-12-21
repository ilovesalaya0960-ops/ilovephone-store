-- Migration: Add battery_health column to used_devices table
-- Date: 2025-12-21

ALTER TABLE used_devices 
ADD COLUMN battery_health INT NULL 
AFTER rom;

-- Add index for battery_health if needed
-- CREATE INDEX idx_battery_health ON used_devices(battery_health);

