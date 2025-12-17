-- Migration: Add serial_no column to installment_devices table
-- Created: 2025-01-17
-- Description: เพิ่มฟิลด์ Serial No สำหรับเก็บข้อมูลเครื่อง

-- เพิ่มคอลัมน์ serial_no
ALTER TABLE installment_devices ADD COLUMN serial_no VARCHAR(255) COMMENT 'Serial Number' AFTER imei;

-- สร้าง index สำหรับการค้นหา (optional แต่แนะนำ)
CREATE INDEX idx_serial_no ON installment_devices(serial_no);

-- แสดงโครงสร้างตารางเพื่อยืนยันการเปลี่ยนแปลง
DESCRIBE installment_devices;

