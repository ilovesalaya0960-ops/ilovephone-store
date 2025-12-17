-- Migration: Create store_settings table
-- Created: 2025-01-17
-- Description: สร้างตารางเก็บข้อมูลการตั้งค่าร้านค้า

-- สร้างตาราง store_settings
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(255),
    store_phone VARCHAR(50),
    store_line VARCHAR(500),
    store_facebook VARCHAR(500),
    store_email VARCHAR(255),
    store_payment_page VARCHAR(500),
    store_address TEXT,
    store_logo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert ข้อมูลเริ่มต้น
INSERT INTO store_settings (store_name, store_phone, store_line, store_facebook, store_email, store_payment_page, store_address)
VALUES (
    'FHIN CONNEXT',
    '0929167622',
    'https://line.ee/41ZW03X',
    'https://www.facebook.com/fhinconnext',
    'iloveklongyong@gmail.com',
    '-',
    'ร้านไอเลิฟเฟน สาขา หน้า 7-11 บมค. คลองสี่'
);

-- แสดงโครงสร้างตารางเพื่อยืนยัน
DESCRIBE store_settings;

