-- Migration: Fix accessories store field values
-- Date: 2025-11-16
-- Description:
--   Convert store names to store IDs for proper filtering
--   This fixes the issue where store field contains names instead of IDs

USE ilovephone_db;

-- Update store field to use store IDs instead of store names
UPDATE accessories
SET store = 'salaya'
WHERE store = 'ร้านศาลายา' OR store = 'ร้านไอเลิฟโฟน - ศาลายา';

UPDATE accessories
SET store = 'klongyong'
WHERE store = 'ร้านคลองโยง' OR store = 'ร้านไอเลิฟโฟน - คลองโยง';

-- Update any records where store is NULL but store_id has a value
UPDATE accessories
SET store = store_id
WHERE (store IS NULL OR store = '') AND store_id IS NOT NULL;

-- Verification query (run this to check):
SELECT id, code, brand, models, store_id, store, quantity FROM accessories LIMIT 10;
