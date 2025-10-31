-- Add purchased_from field to new_devices table
-- This field stores the source/supplier where the device was purchased from

ALTER TABLE new_devices 
ADD COLUMN purchased_from VARCHAR(100) AFTER rom;

-- Update existing records to have a default value (optional)
-- UPDATE new_devices SET purchased_from = 'ไม่ระบุ' WHERE purchased_from IS NULL;

