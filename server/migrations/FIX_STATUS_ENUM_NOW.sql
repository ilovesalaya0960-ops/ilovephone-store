-- ========================================
-- FIX: Add 'claimed' to status ENUM
-- Run this in Sequel Ace RIGHT NOW
-- ========================================

-- Step 1: Check current status ENUM
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'new_devices' 
  AND COLUMN_NAME = 'status';

-- Step 2: Add 'claimed' to new_devices status ENUM
ALTER TABLE new_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') NOT NULL DEFAULT 'stock';

-- Step 3: Add 'claimed' to used_devices status ENUM  
ALTER TABLE used_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') NOT NULL DEFAULT 'stock';

-- Step 4: Add claim_date column to new_devices
ALTER TABLE new_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL AFTER sale_date;

-- Step 5: Add claim_note column to new_devices
ALTER TABLE new_devices 
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL AFTER claim_date;

-- Step 6: Add claim_date column to used_devices
ALTER TABLE used_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL AFTER sale_date;

-- Step 7: Add claim_note column to used_devices
ALTER TABLE used_devices 
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL AFTER claim_date;

-- Step 8: Verify the changes
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'new_devices' 
  AND COLUMN_NAME = 'status';

SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'used_devices' 
  AND COLUMN_NAME = 'status';

-- ========================================
-- You should see: enum('stock','sold','removed','claimed')
-- ========================================
