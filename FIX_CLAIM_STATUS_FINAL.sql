-- ====================================================================
-- FIX: เพิ่ม 'claimed' เข้าไปใน status ENUM
-- รัน SQL นี้ใน Sequel Ace เพื่อแก้ไข Error: Data truncated
-- ====================================================================

-- ขั้นตอนที่ 1: ตรวจสอบ status ENUM ปัจจุบัน
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME IN ('new_devices', 'used_devices')
  AND COLUMN_NAME = 'status';

-- ===== คุณควรเห็น: enum('stock','sold','removed') ไม่มี 'claimed' =====

-- ขั้นตอนที่ 2: เพิ่ม 'claimed' เข้าไปใน new_devices
ALTER TABLE `new_devices` 
MODIFY COLUMN `status` ENUM('stock', 'sold', 'removed', 'claimed') NOT NULL DEFAULT 'stock';

-- ขั้นตอนที่ 3: เพิ่ม 'claimed' เข้าไปใน used_devices
ALTER TABLE `used_devices` 
MODIFY COLUMN `status` ENUM('stock', 'sold', 'removed', 'claimed') NOT NULL DEFAULT 'stock';

-- ขั้นตอนที่ 4: เพิ่มคอลัมน์ claim_date (new_devices)
ALTER TABLE `new_devices` 
ADD COLUMN `claim_date` DATE NULL AFTER `sale_date`;

-- ขั้นตอนที่ 5: เพิ่มคอลัมน์ claim_note (new_devices)
ALTER TABLE `new_devices` 
ADD COLUMN `claim_note` TEXT NULL AFTER `claim_date`;

-- ขั้นตอนที่ 6: เพิ่มคอลัมน์ claim_date (used_devices)
ALTER TABLE `used_devices` 
ADD COLUMN `claim_date` DATE NULL AFTER `sale_date`;

-- ขั้นตอนที่ 7: เพิ่มคอลัมน์ claim_note (used_devices)
ALTER TABLE `used_devices` 
ADD COLUMN `claim_note` TEXT NULL AFTER `claim_date`;

-- ขั้นตอนที่ 8: ตรวจสอบผลลัพธ์
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME IN ('new_devices', 'used_devices')
  AND COLUMN_NAME = 'status';

-- ===== ตอนนี้ควรเห็น: enum('stock','sold','removed','claimed') มี 'claimed' แล้ว! =====

-- ขั้นตอนที่ 9: แสดงโครงสร้างตาราง
DESCRIBE `new_devices`;
DESCRIBE `used_devices`;

-- ====================================================================
-- เสร็จแล้ว! กลับไปหน้าเว็บ → Refresh (Cmd+Shift+R) → ลองเคลมอีกครั้ง
-- ====================================================================
