-- Migration: Add sub_type column to equipment table
-- Description: เพิ่มคอลัมน์ sub_type สำหรับเก็บประเภทย่อยของอุปกรณ์ (เช่น USB Type-C, USB Lightning)
-- Created: 2025-11-19

-- เพิ่มคอลัมน์ sub_type
ALTER TABLE equipment
ADD COLUMN sub_type VARCHAR(50) NULL COMMENT 'ประเภทย่อย (usb-type-c, usb-lightning, usb-micro, c-type-c, c-lightning, other)' AFTER model;

-- เพิ่ม index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_equipment_sub_type ON equipment(sub_type);

-- อัพเดท comment ของตาราง
ALTER TABLE equipment 
COMMENT = 'ตารางเก็บข้อมูลอุปกรณ์ (ชุดชาร์ต, สายชาร์ต, หูฟัง, ฯลฯ) พร้อม sub_type';

-- แสดงโครงสร้างตารางหลังการอัพเดท
DESCRIBE equipment;

-- ตัวอย่างการ query ข้อมูลตาม sub_type
-- SELECT * FROM equipment WHERE type = 'charger-set' AND sub_type = 'usb-type-c';

