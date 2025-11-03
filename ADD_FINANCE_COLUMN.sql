-- ================================
-- เพิ่มคอลัมน์ finance ในตาราง installments
-- คัดลอกทั้งหมดนี้ไปวางใน Sequel Ace
-- ================================

-- เช็คว่ามีคอลัมน์ finance อยู่แล้วหรือยัง
SELECT COUNT(*) as has_finance_column
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_store' 
  AND TABLE_NAME = 'installments' 
  AND COLUMN_NAME = 'finance';

-- ถ้าผลลัพธ์เป็น 0 = ยังไม่มี ให้รันคำสั่งด้านล่าง
-- ถ้าผลลัพธ์เป็น 1 = มีแล้ว ไม่ต้องรันอะไร

-- เพิ่มคอลัมน์ finance
ALTER TABLE installments
ADD COLUMN finance VARCHAR(255) AFTER note;

-- ตรวจสอบว่าเพิ่มสำเร็จ
DESCRIBE installments;

-- ดูข้อมูล 5 แถวล่าสุด
SELECT id, brand, model, sale_price, finance, created_at 
FROM installments 
ORDER BY created_at DESC 
LIMIT 5;

