-- ===================================
-- 🔧 SIMPLE FIX: เพิ่มคอลัมน์ที่ขาดหาย
-- ===================================
-- Copy SQL ทั้งหมดนี้ไปรันใน Sequel Ace

-- 1. เพิ่ม commission
ALTER TABLE installment_devices 
ADD COLUMN commission DECIMAL(10,2) DEFAULT 0 AFTER sale_price;

-- 2. เพิ่ม next_payment_due_date
ALTER TABLE installment_devices 
ADD COLUMN next_payment_due_date DATE AFTER down_payment_date;

-- 3. เพิ่ม installment_type
ALTER TABLE installment_devices 
ADD COLUMN installment_type ENUM('partner', 'store') DEFAULT 'partner' AFTER status;

-- 4. เพิ่ม finance (สำคัญ!)
ALTER TABLE installment_devices 
ADD COLUMN finance VARCHAR(255) AFTER note;

-- 5. เพิ่ม store
ALTER TABLE installment_devices 
ADD COLUMN store VARCHAR(50) AFTER finance;

-- 6. Update ข้อมูลเดิม
UPDATE installment_devices 
SET commission = 0 
WHERE commission IS NULL;

UPDATE installment_devices 
SET installment_type = 'partner' 
WHERE installment_type IS NULL OR installment_type = '';

UPDATE installment_devices 
SET finance = '' 
WHERE finance IS NULL;

UPDATE installment_devices 
SET store = 'salaya'
WHERE store IS NULL OR store = '';

-- เสร็จสิ้น! ✅
SELECT 'Migration completed!' AS status, 
       COUNT(*) AS total_installments 
FROM installment_devices;

