-- Migration: Add bank information to store_settings table
-- Created: 2025-01-18
-- Description: เพิ่มฟิลด์ข้อมูลธนาคารสำหรับรับชำระเงิน

-- เพิ่มคอลัมน์ข้อมูลธนาคาร
ALTER TABLE store_settings ADD COLUMN store_bank VARCHAR(255) COMMENT 'ชื่อธนาคาร';
ALTER TABLE store_settings ADD COLUMN store_bank_account_number VARCHAR(50) COMMENT 'เลขบัญชีธนาคาร';
ALTER TABLE store_settings ADD COLUMN store_bank_account_name VARCHAR(255) COMMENT 'ชื่อบัญชีธนาคาร';

-- แสดงโครงสร้างตารางเพื่อยืนยันการเปลี่ยนแปลง
DESCRIBE store_settings;
