-- Migration: Add claim fields to repairs table
-- Description: Add claim_date and update status ENUM to include 'claimed' for repair claim management

USE ilovephone_db;

-- Step 1: Modify status ENUM to include 'claimed'
ALTER TABLE repairs 
MODIFY COLUMN status ENUM('pending', 'in-repair', 'completed', 'returned', 'received', 'seized', 'claimed') DEFAULT 'pending';

-- Step 2: Add claim_date column
ALTER TABLE repairs
ADD COLUMN claim_date DATE NULL AFTER seized_date;

-- Step 3: Add index for claim_date
CREATE INDEX idx_repairs_claim_date ON repairs(claim_date);

-- Step 4: Verify the changes
DESCRIBE repairs;
SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'repairs' AND COLUMN_NAME = 'status';
