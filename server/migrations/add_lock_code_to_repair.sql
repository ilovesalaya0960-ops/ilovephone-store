-- Migration: Add lock_code column to repairs table
-- Created: 2025-01-18
-- Description: เพิ่มฟิลด์รหัสล็อคหน้าจอสำหรับเครื่องซ่อม

-- เพิ่มคอลัมน์ lock_code
ALTER TABLE repairs ADD COLUMN lock_code VARCHAR(100) COMMENT 'รหัสล็อคหน้าจอ' AFTER imei;

-- แสดงโครงสร้างตารางเพื่อยืนยันการเปลี่ยนแปลง
DESCRIBE repairs;

