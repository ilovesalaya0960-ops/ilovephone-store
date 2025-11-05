-- Add lock_system_fee column to installment_devices table
ALTER TABLE installment_devices
ADD COLUMN lock_system_fee DECIMAL(10,2) DEFAULT 0 AFTER sale_price;

