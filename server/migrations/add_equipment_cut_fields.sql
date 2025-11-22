-- Add cut fields to equipment table
-- Check if columns exist before adding them

-- Add cut_quantity column
SET @query = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'ilovephone_db' 
     AND TABLE_NAME = 'equipment' 
     AND COLUMN_NAME = 'cut_quantity') = 0,
    'ALTER TABLE equipment ADD COLUMN cut_quantity INT DEFAULT 0 COMMENT ''จำนวนที่ตัดไปแล้ว''',
    'SELECT ''Column cut_quantity already exists'' AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add cut_price column
SET @query = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'ilovephone_db' 
     AND TABLE_NAME = 'equipment' 
     AND COLUMN_NAME = 'cut_price') = 0,
    'ALTER TABLE equipment ADD COLUMN cut_price DECIMAL(10,2) DEFAULT 0 COMMENT ''ราคาตัดต่อชิ้น''',
    'SELECT ''Column cut_price already exists'' AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add cut_date column
SET @query = IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'ilovephone_db' 
     AND TABLE_NAME = 'equipment' 
     AND COLUMN_NAME = 'cut_date') = 0,
    'ALTER TABLE equipment ADD COLUMN cut_date DATE DEFAULT NULL COMMENT ''วันที่ตัดล่าสุด''',
    'SELECT ''Column cut_date already exists'' AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to have default values
UPDATE equipment 
SET cut_quantity = COALESCE(cut_quantity, 0), 
    cut_price = COALESCE(cut_price, 0) 
WHERE cut_quantity IS NULL OR cut_price IS NULL;

