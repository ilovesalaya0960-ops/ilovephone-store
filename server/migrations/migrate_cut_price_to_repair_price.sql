-- Migrate cut_price to repair_price for accessories with cut_quantity > 0
-- This ensures that cut accessories display the correct price

-- Check if cut_price column exists and has data
UPDATE accessories
SET repair_price = COALESCE(cut_price, repair_price)
WHERE cut_quantity > 0
  AND cut_price IS NOT NULL
  AND cut_price > 0;

-- You can drop cut_price column after migration if needed (optional)
-- ALTER TABLE accessories DROP COLUMN IF EXISTS cut_price;

