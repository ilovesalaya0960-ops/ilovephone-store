-- ===================================
-- อัปเดต package_sale สำหรับซิม 0989934742
-- ===================================

USE ilovephone_db;

-- 1. ตรวจสอบข้อมูลปัจจุบัน
SELECT '=== ข้อมูลปัจจุบัน ===' AS '';
SELECT 
    id,
    provider,
    phone_number,
    package,
    package_sale,
    status,
    sale_date
FROM simcards 
WHERE phone_number = '0989934742' 
   OR phone_number = '098-993-4742'
   OR phone_number LIKE '%0989934742%';

-- 2. อัปเดต package_sale = 100 สำหรับเบอร์ 0989934742 ที่ขายแล้ว
UPDATE simcards 
SET package_sale = 100
WHERE (phone_number = '0989934742' 
   OR phone_number = '098-993-4742'
   OR phone_number LIKE '%0989934742%')
  AND status = 'sold';

-- 3. แสดงข้อมูลหลังอัปเดต
SELECT '=== ข้อมูลหลังอัปเดต ===' AS '';
SELECT 
    id,
    provider,
    phone_number,
    package,
    package_sale,     -- ต้องเป็น 100.00
    cost_price,
    sale_price,
    status,
    sale_date
FROM simcards 
WHERE phone_number = '0989934742' 
   OR phone_number = '098-993-4742'
   OR phone_number LIKE '%0989934742%';

-- 4. ตรวจสอบซิมที่ขายแล้วทั้งหมด
SELECT '=== ซิมที่ขายแล้วทั้งหมด ===' AS '';
SELECT 
    provider,
    phone_number,
    package,
    package_sale,
    sale_price,
    sale_date
FROM simcards 
WHERE status = 'sold'
ORDER BY sale_date DESC
LIMIT 10;

