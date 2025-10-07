-- ===================================
-- Database Schema for I Love Phone Management System
-- ===================================

CREATE DATABASE IF NOT EXISTS ilovephone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ilovephone_db;

-- ===================================
-- 1. New Devices (เครื่องใหม่)
-- ===================================
CREATE TABLE new_devices (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    imei VARCHAR(15) NOT NULL UNIQUE,
    ram VARCHAR(10) NOT NULL,
    rom VARCHAR(10) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    sale_price DECIMAL(10,2),
    sale_date DATE,
    status ENUM('stock', 'sold', 'removed') DEFAULT 'stock',
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_status (status),
    INDEX idx_imei (imei)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 2. Used Devices (เครื่องมือสอง)
-- ===================================
CREATE TABLE used_devices (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    imei VARCHAR(15) NOT NULL UNIQUE,
    ram VARCHAR(10) NOT NULL,
    rom VARCHAR(10) NOT NULL,
    device_condition VARCHAR(100) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    sale_price DECIMAL(10,2),
    sale_date DATE,
    status ENUM('stock', 'sold', 'removed') DEFAULT 'stock',
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 3. Repairs (เครื่องซ่อม)
-- ===================================
CREATE TABLE repairs (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    imei VARCHAR(15) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    problem TEXT NOT NULL,
    repair_cost DECIMAL(10,2) NOT NULL,
    received_date DATE NOT NULL,
    appointment_date DATE,
    completed_date DATE,
    returned_date DATE,
    status ENUM('pending', 'in-repair', 'completed', 'returned', 'received') DEFAULT 'pending',
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_status (status),
    INDEX idx_customer_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 4. Installment Devices (เครื่องผ่อน)
-- ===================================
CREATE TABLE installment_devices (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    imei VARCHAR(15) NOT NULL,
    ram VARCHAR(10) NOT NULL,
    rom VARCHAR(10) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    down_payment DECIMAL(10,2) NOT NULL,
    total_installments INT NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    paid_installments INT DEFAULT 0,
    down_payment_date DATE NOT NULL,
    completed_date DATE,
    seized_date DATE,
    status ENUM('active', 'completed', 'seized') DEFAULT 'active',
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_status (status),
    INDEX idx_customer_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 5. Installment Payment History (ประวัติการผ่อน)
-- ===================================
CREATE TABLE installment_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    installment_id VARCHAR(50) NOT NULL,
    installment_number INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installment_id) REFERENCES installment_devices(id) ON DELETE CASCADE,
    INDEX idx_installment_id (installment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 6. Pawn Devices (เครื่องขายฝาก)
-- ===================================
CREATE TABLE pawn_devices (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    color VARCHAR(100) NOT NULL,
    imei VARCHAR(15) NOT NULL,
    ram VARCHAR(10) NOT NULL,
    rom VARCHAR(10) NOT NULL,
    pawn_amount DECIMAL(10,2) NOT NULL,
    interest DECIMAL(10,2) NOT NULL,
    receive_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    seized_date DATE,
    status ENUM('active', 'returned', 'seized') DEFAULT 'active',
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 7. Accessories (อะไหล่)
-- ===================================
CREATE TABLE accessories (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('battery', 'screen', 'charging', 'switch') NOT NULL,
    code VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    models VARCHAR(500) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    claim_quantity INT NOT NULL DEFAULT 0,
    cost_price DECIMAL(10,2) NOT NULL,
    repair_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    claim_date DATE,
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_type (type),
    INDEX idx_quantity (quantity),
    INDEX idx_claim_quantity (claim_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 8. Equipment (อุปกรณ์)
-- ===================================
CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('charger-set', 'cable', 'adapter', 'earphone', 'bluetooth', 'screen-protector', 'powerbank', 'speaker', 'case') NOT NULL,
    code VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    cost_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    note TEXT,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store (store),
    INDEX idx_type (type),
    INDEX idx_quantity (quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- สร้าง User สำหรับเข้าถึง Database (Optional)
-- ===================================
-- CREATE USER 'ilovephone_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON ilovephone_db.* TO 'ilovephone_user'@'localhost';
-- FLUSH PRIVILEGES;
