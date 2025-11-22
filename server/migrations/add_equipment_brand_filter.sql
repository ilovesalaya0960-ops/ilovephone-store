-- Add brand_filter field to equipment table for screen-protector brand filtering

ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS brand_filter VARCHAR(50) COMMENT 'ยี่ห้อเครื่อง สำหรับฟิล์มกันรอย (apple, samsung, oppo, vivo, redmi, other)';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_brand_filter ON equipment(brand_filter);

-- Update existing screen-protector items to have brand_filter (optional, for data migration)
-- UPDATE equipment SET brand_filter = 'other' WHERE type = 'screen-protector' AND brand_filter IS NULL;

