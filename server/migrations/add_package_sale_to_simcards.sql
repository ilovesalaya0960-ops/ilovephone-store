USE ilovephone_db;

-- เพิ่มคอลัมน์ package_sale ต่อจาก package
ALTER TABLE simcards
ADD COLUMN package_sale VARCHAR(255) NULL COMMENT 'แพ็กเกจที่ขายออกไป'
AFTER package;
