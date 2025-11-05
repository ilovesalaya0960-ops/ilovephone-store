-- ===================================
-- Complete Fix for Installment Table
-- ===================================
-- เพิ่มคอลัมน์ที่ขาดหายทั้งหมดในตาราง installment_devices

-- 1. เพิ่ม commission (ค่าคอม)
ALTER TABLE installment_devices 
ADD COLUMN IF NOT EXISTS commission DECIMAL(10,2) DEFAULT 0 AFTER sale_price;

-- 2. เพิ่ม next_payment_due_date (วันครบกำหนดงวดถัดไป)
ALTER TABLE installment_devices 
ADD COLUMN IF NOT EXISTS next_payment_due_date DATE AFTER down_payment_date;

-- 3. เพิ่ม installment_type (ประเภทการผ่อน: partner/store)
ALTER TABLE installment_devices 
ADD COLUMN IF NOT EXISTS installment_type ENUM('partner', 'store') DEFAULT 'partner' AFTER status;

-- 4. เพิ่ม finance (ข้อมูล finance)
ALTER TABLE installment_devices 
ADD COLUMN IF NOT EXISTS finance VARCHAR(255) AFTER note;

-- 5. เปลี่ยน store_id เป็น store (เก็บเป็น string: salaya/klongyong)
ALTER TABLE installment_devices 
ADD COLUMN IF NOT EXISTS store VARCHAR(50) AFTER finance;

-- 6. Copy ข้อมูลจาก store_id ไปยัง store (ถ้ามีข้อมูลเดิม)
UPDATE installment_devices 
SET store = CASE 
    WHEN store_id = '1' THEN 'salaya'
    WHEN store_id = '2' THEN 'klongyong'
    ELSE store_id 
END
WHERE store IS NULL OR store = '';

-- 7. ตรวจสอบและอัพเดท default values
UPDATE installment_devices 
SET commission = 0 
WHERE commission IS NULL;

UPDATE installment_devices 
SET installment_type = 'partner' 
WHERE installment_type IS NULL;

UPDATE installment_devices 
SET finance = '' 
WHERE finance IS NULL;

-- 8. สร้าง index เพิ่มเติมสำหรับประสิทธิภาพ
CREATE INDEX IF NOT EXISTS idx_store ON installment_devices(store);
CREATE INDEX IF NOT EXISTS idx_installment_type ON installment_devices(installment_type);
CREATE INDEX IF NOT EXISTS idx_next_payment_due ON installment_devices(next_payment_due_date);

-- เสร็จสิ้น!
SELECT 'Migration completed successfully!' AS status;

