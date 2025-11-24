-- ===================================
-- Create Simcards Table
-- ===================================

USE ilovephone_db;

CREATE TABLE IF NOT EXISTS simcards (
    id VARCHAR(50) PRIMARY KEY,
    provider VARCHAR(50) NOT NULL COMMENT 'ผู้ให้บริการ (AIS, True, Dtac, etc.)',
    phone_number VARCHAR(20) NOT NULL COMMENT 'เบอร์โทร',
    package VARCHAR(100) NOT NULL COMMENT 'แพ็กเกจ (เติมเงิน, รายเดือน, etc.)',
    cost_price DECIMAL(10,2) NOT NULL COMMENT 'ราคาทุน',
    sale_price DECIMAL(10,2) NOT NULL COMMENT 'ราคาขาย',
    import_date DATE NOT NULL COMMENT 'วันที่นำเข้า',
    sale_date DATE NULL COMMENT 'วันที่ขาย',
    return_date DATE NULL COMMENT 'วันที่คืน',
    status ENUM('available', 'sold', 'returned') DEFAULT 'available' COMMENT 'สถานะ',
    note TEXT NULL COMMENT 'หมายเหตุ',
    store VARCHAR(50) NOT NULL COMMENT 'ร้าน (salaya, klongyong)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store_status (store, status),
    INDEX idx_provider (provider),
    INDEX idx_phone_number (phone_number),
    INDEX idx_sale_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
