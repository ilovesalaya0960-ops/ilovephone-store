-- ============================================
-- แก้ไขหมายเหตุของ Redmi A5 (IMEI: 2244_T121264)
-- ลบข้อความ "ตัดสลับไปร้านไอเลิฟโฟน - คลองโยง" ออก
-- ============================================

USE mobile_shop_db;

-- แสดงข้อมูลปัจจุบันก่อนแก้ไข
SELECT 
    id,
    brand,
    model,
    color,
    imei,
    CONCAT(ram, '/', rom, ' GB') AS specs,
    purchase_price,
    sale_price,
    (sale_price - purchase_price) AS profit,
    sale_date,
    store,
    note,
    status
FROM used_devices 
WHERE imei = '2244_T121264'
   OR imei LIKE '%T121264%'
   OR (brand = 'Redmi' AND model = 'A5' AND sale_date = '2025-11-06');

-- ค้นหาด้วยเงื่อนไขที่หลากหลาย (กรณีไม่พบด้วย IMEI)
SELECT 
    id,
    brand,
    model,
    color,
    imei,
    purchase_price,
    sale_price,
    sale_date,
    store,
    note
FROM used_devices 
WHERE (brand LIKE '%Redmi%' OR brand LIKE '%Xiaomi%')
  AND model LIKE '%A5%'
  AND purchase_price = 1996
  AND sale_price = 2750
  AND store = 'salaya'
ORDER BY sale_date DESC
LIMIT 5;

-- แก้ไขข้อมูล: ลบหมายเหตุที่ไม่ถูกต้องออก
-- อัพเดท note ให้เป็นค่าว่างหรือข้อความที่ถูกต้อง
UPDATE used_devices 
SET note = NULL
WHERE imei = '2244_T121264'
   OR imei LIKE '%T121264%';

-- ถ้าไม่พบด้วย IMEI ให้ใช้เงื่อนไขอื่น
UPDATE used_devices 
SET note = 'โอนสต็อกจากร้านคลองโยงมาศาลายา (30 ต.ค. 2568) และขายที่ศาลายาแล้ว'
WHERE (brand LIKE '%Redmi%' OR brand LIKE '%Xiaomi%')
  AND model LIKE '%A5%'
  AND purchase_price = 1996
  AND sale_price = 2750
  AND store = 'salaya'
  AND sale_date = '2025-11-06'
  AND note LIKE '%ตัดสลับไปร้าน%คลองโยง%';

-- แสดงข้อมูลหลังแก้ไข
SELECT 
    id,
    brand,
    model,
    color,
    imei,
    CONCAT(ram, '/', rom, ' GB') AS specs,
    purchase_price,
    sale_price,
    (sale_price - purchase_price) AS profit,
    sale_date,
    store,
    note,
    status
FROM used_devices 
WHERE imei = '2244_T121264'
   OR imei LIKE '%T121264%'
   OR (brand LIKE '%Redmi%' AND model LIKE '%A5%' AND sale_date = '2025-11-06' AND store = 'salaya');

SELECT '✅ แก้ไขหมายเหตุสำเร็จ!' AS result;

