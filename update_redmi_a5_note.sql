-- อัพเดทหมายเหตุของ Redmi A5 (รหัส 2244_T121264)
-- ลบข้อความ "ตัดสลับไปร้านร้านไอเลิฟโฟน - คลองโยง" เพราะสินค้าขายที่ร้านศาลายาแล้ว

-- ค้นหารายการก่อน (ใน used_devices)
SELECT id, brand, model, color, imei, purchase_price, sale_price, sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264';

-- ค้นหารายการก่อน (ใน new_devices)
SELECT id, brand, model, color, imei, purchase_price, sale_price, sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';

-- อัพเดทหมายเหตุให้เป็นค่าว่าง (ถ้าอยู่ใน used_devices)
UPDATE used_devices
SET note = ''
WHERE imei = '2244_T121264';

-- อัพเดทหมายเหตุให้เป็นค่าว่าง (ถ้าอยู่ใน new_devices)
UPDATE new_devices
SET note = ''
WHERE imei = '2244_T121264';

-- ตรวจสอบผลลัพธ์อีกครั้ง
SELECT id, brand, model, color, imei, purchase_price, sale_price, sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264'
UNION ALL
SELECT id, brand, model, color, imei, purchase_price, sale_price, sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';

