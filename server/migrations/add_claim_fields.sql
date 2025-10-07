-- Migration: Add claim fields to accessories table
-- Date: 2025-10-07
-- Description: Add claim_quantity and claim_date fields to support claim management

USE ilovephone_db;

-- Add claim_quantity field
ALTER TABLE accessories
ADD COLUMN claim_quantity INT NOT NULL DEFAULT 0 AFTER quantity;

-- Add claim_date field
ALTER TABLE accessories
ADD COLUMN claim_date DATE AFTER import_date;

-- Add index for claim_quantity
ALTER TABLE accessories
ADD INDEX idx_claim_quantity (claim_quantity);
