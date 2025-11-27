-- ===================================
-- Quick Fix: เพิ่ม column package_sale และตรวจสอบข้อมูล
-- ===================================

USE ilovephone_db;

-- 1. ตรวจสอบโครงสร้างตารางปัจจุบัน
SELECT '=== ตรวจสอบ Schema ===' AS '';
DESC simcards;

-- 2. เพิ่ม column package_sale (ถ้ายังไม่มี)
SELECT '=== เพิ่ม Column package_sale ===' AS '';

-- ตรวจสอบว่ามี column package_sale หรือยัง
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ilovephone_db' 
      AND TABLE_NAME = 'simcards'
      AND COLUMN_NAME = 'package_sale'
);

-- ถ้ายังไม่มี ให้เพิ่ม
SET @sql_add_col = IF(
    @col_exists = 0,
    'ALTER TABLE simcards ADD COLUMN package_sale DECIMAL(10,2) NULL COMMENT "ยอดเติมเงิน/อินเตอร์เน็ต" AFTER sale_price',
    'SELECT "Column package_sale already exists" AS message'
);

PREPARE stmt FROM @sql_add_col;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. แสดงโครงสร้างตารางหลังแก้ไข
SELECT '=== Schema หลังแก้ไข ===' AS '';
DESC simcards;

-- 4. ตรวจสอบข้อมูลซิมทั้งหมด
SELECT '=== ข้อมูลซิมทั้งหมด ===' AS '';
SELECT 
    id,
    provider,
    phone_number,
    package,
    package_sale,
    cost_price,
    sale_price,
    status,
    sale_date
FROM simcards 
ORDER BY created_at DESC
LIMIT 10;

-- 5. ตรวจสอบซิม DTAC 0989934742 โดยเฉพาะ
SELECT '=== ซิม DTAC 0989934742 ===' AS '';
SELECT 
    id,
    provider,
    phone_number,
    package,
    package_sale,
    cost_price,
    sale_price,
    status,
    sale_date,
    created_at,
    updated_at
FROM simcards 
WHERE phone_number = '0989934742'
   OR phone_number = '098-993-4742'
   OR phone_number LIKE '%0989934742%';

