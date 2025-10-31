-- สร้างตาราง pawn_interest_transactions
-- ใช้สำหรับบันทึกดอกเบี้ยจากการต่อดอก และค่าปรับ

USE ilovephone_db;

CREATE TABLE IF NOT EXISTS pawn_interest_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pawn_id VARCHAR(50) NOT NULL,
    interest_amount DECIMAL(10,2) NOT NULL,
    late_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    transaction_type ENUM('initial_deduction', 'renewal') NOT NULL,
    transaction_date DATE NOT NULL,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pawn_id (pawn_id),
    INDEX idx_store (store),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_late_fee (late_fee)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- แสดงข้อความยืนยัน
SELECT 'สร้างตาราง pawn_interest_transactions สำเร็จ!' as message;

