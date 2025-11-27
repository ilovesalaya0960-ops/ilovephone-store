USE ilovephone_db;

-- เพิ่มคอลัมน์ topup_amount สำหรับเก็บยอดเติมเงิน/อินเตอร์เน็ต
ALTER TABLE simcards
ADD COLUMN topup_amount DECIMAL(10,2) NULL DEFAULT 0 COMMENT 'ยอดเติมเงิน/อินเตอร์เน็ต'
AFTER sale_price;

-- อัปเดตข้อมูลเก่า: ย้ายยอดเติมจาก package_sale ไปยัง topup_amount
-- (กรณีที่ package_sale เป็นตัวเลข)
UPDATE simcards
SET topup_amount = CAST(package_sale AS DECIMAL(10,2)),
    package_sale = NULL
WHERE package_sale REGEXP '^[0-9]+(\.[0-9]+)?$'
  AND status = 'sold';
