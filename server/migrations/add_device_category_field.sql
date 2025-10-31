-- Add device_category field to new_devices table
-- This field stores the category of the device (No Active or Active)

ALTER TABLE new_devices 
ADD COLUMN device_category ENUM('No Active', 'Active') DEFAULT 'No Active' AFTER purchased_from;

-- Update existing records to have default value
UPDATE new_devices SET device_category = 'No Active' WHERE device_category IS NULL;

