-- ===================================
-- Create Service Center Table
-- ===================================

USE ilovephone_db;

CREATE TABLE IF NOT EXISTS service_center (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL COMMENT 'ชื่อลูกค้า',
    customer_phone VARCHAR(20) NOT NULL COMMENT 'เบอร์โทรศัพท์',
    brand VARCHAR(100) NOT NULL COMMENT 'ยี่ห้อ',
    model VARCHAR(100) NOT NULL COMMENT 'รุ่น',
    imei VARCHAR(50) NOT NULL COMMENT 'IMEI 15 หลัก',
    symptom TEXT NOT NULL COMMENT 'อาการของเครื่อง',
    purchase_date DATE NOT NULL COMMENT 'วันที่ซื้อเครื่อง',
    send_date DATE NOT NULL COMMENT 'วันที่ส่งศูนย์',
    return_date DATE NULL COMMENT 'วันที่รับคืนจากศูนย์',
    cancel_date DATE NULL COMMENT 'วันที่ยกเลิก',
    service_center VARCHAR(200) NOT NULL COMMENT 'ชื่อศูนย์บริการ',
    cancel_reason TEXT NULL COMMENT 'เหตุผลที่ยกเลิก',
    note TEXT NULL COMMENT 'หมายเหตุเพิ่มเติม',
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending' COMMENT 'สถานะ (กำลังดำเนินการ, เสร็จสิ้น, ยกเลิก)',
    store VARCHAR(50) NOT NULL COMMENT 'ร้าน (salaya, klongyong)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store_status (store, status),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_imei (imei),
    INDEX idx_send_date (send_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='ตารางเก็บข้อมูลเครื่องส่งศูนย์';
