-- ===================================
-- ตรวจสอบและแก้ไข Schema ของตาราง simcards
-- ===================================

USE ilovephone_db;

-- 1. ตรวจสอบโครงสร้างตารางปัจจุบัน
SELECT 'Current simcards table structure:' AS '';
DESC simcards;

-- 2. ตรวจสอบว่ามี column package_sale หรือยัง
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'simcards'
  AND COLUMN_NAME = 'package_sale';

-- 3. เพิ่ม column package_sale (ถ้ายังไม่มี)
-- หมายเหตุ: คำสั่งนี้จะไม่ error ถ้า column มีอยู่แล้ว (เพราะมี IF NOT EXISTS ใน ALTER TABLE)
ALTER TABLE simcards 
ADD COLUMN IF NOT EXISTS package_sale DECIMAL(10,2) NULL 
    COMMENT 'ยอดเติมเงิน/อินเตอร์เน็ต (แยกจาก sale_price)' 
    AFTER sale_price;

-- 4. ตรวจสอบ index
SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'ilovephone_db'
  AND TABLE_NAME = 'simcards'
  AND INDEX_NAME = 'idx_package_sale';

-- 5. เพิ่ม index (ถ้ายังไม่มี)
-- หมายเหตุ: คำสั่งนี้อาจจะ error ถ้า index มีอยู่แล้ว แต่ไม่เป็นไร
-- ALTER TABLE simcards ADD INDEX idx_package_sale (package_sale);

-- 6. แสดงโครงสร้างตารางหลังแก้ไข
SELECT 'Updated simcards table structure:' AS '';
DESC simcards;

-- 7. ตรวจสอบข้อมูลซิมที่ขายแล้ว
SELECT 
    id,
    provider,
    phone_number,
    cost_price,
    sale_price,
    package_sale,
    package,
    status,
    sale_date
FROM simcards 
WHERE status = 'sold'
ORDER BY sale_date DESC
LIMIT 5;


