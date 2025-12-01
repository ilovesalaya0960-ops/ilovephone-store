-- Add 'claimed' to status ENUM for new_devices table
ALTER TABLE new_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') DEFAULT 'stock';

-- Add 'claimed' to status ENUM for used_devices table
ALTER TABLE used_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') DEFAULT 'stock';

-- Add claim_date column to new_devices table
ALTER TABLE new_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL AFTER sale_date,
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL AFTER claim_date;

-- Add claim_date column to used_devices table
ALTER TABLE used_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL AFTER sale_date,
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL AFTER claim_date;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_new_devices_claim_date ON new_devices(claim_date);
CREATE INDEX IF NOT EXISTS idx_used_devices_claim_date ON used_devices(claim_date);

-- Show updated schema
DESCRIBE new_devices;
DESCRIBE used_devices;
