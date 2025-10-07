-- ===================================
-- Mobile Shop Management System
-- Database Schema
-- ===================================

-- Create Database
CREATE DATABASE IF NOT EXISTS mobile_shop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mobile_shop_db;

-- ===================================
-- Table: stores
-- ===================================
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default stores
INSERT INTO stores (id, name, address, phone) VALUES
('salaya', 'ร้านศาลายา', 'ศาลายา นครปฐม', '081-234-5678'),
('klongyong', 'ร้านคลองโยง', 'คลองโยง นครปฐม', '082-345-6789')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ===================================
-- Table: new_devices
-- ===================================
CREATE TABLE IF NOT EXISTS new_devices (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    ram VARCHAR(20),
    rom VARCHAR(20),
    imei VARCHAR(50) UNIQUE,
    purchase_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    import_date DATE NOT NULL,
    sale_date DATE,
    status ENUM('stock', 'sold', 'removed') DEFAULT 'stock',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_imei (imei),
    INDEX idx_sale_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: used_devices
-- ===================================
CREATE TABLE IF NOT EXISTS used_devices (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    ram VARCHAR(20),
    rom VARCHAR(20),
    imei VARCHAR(50) UNIQUE,
    condition_status VARCHAR(50),
    purchase_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    purchase_date DATE NOT NULL,
    sale_date DATE,
    status ENUM('stock', 'sold', 'removed') DEFAULT 'stock',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_imei (imei),
    INDEX idx_sale_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: installment_devices
-- ===================================
CREATE TABLE IF NOT EXISTS installment_devices (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    ram VARCHAR(20),
    rom VARCHAR(20),
    imei VARCHAR(50),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_id_card VARCHAR(20),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_customer (customer_name, customer_phone),
    INDEX idx_completed_date (completed_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: installment_payments
-- ===================================
CREATE TABLE IF NOT EXISTS installment_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    installment_id VARCHAR(50) NOT NULL,
    installment_number INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installment_id) REFERENCES installment_devices(id) ON DELETE CASCADE,
    INDEX idx_installment (installment_id),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: pawn_devices
-- ===================================
CREATE TABLE IF NOT EXISTS pawn_devices (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    ram VARCHAR(20),
    rom VARCHAR(20),
    imei VARCHAR(50),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_id_card VARCHAR(20),
    pawn_amount DECIMAL(10,2) NOT NULL,
    interest DECIMAL(10,2) DEFAULT 0,
    receive_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    seized_date DATE,
    status ENUM('active', 'returned', 'seized') DEFAULT 'active',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_customer (customer_name, customer_phone),
    INDEX idx_return_date (return_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: repair_devices
-- ===================================
CREATE TABLE IF NOT EXISTS repair_devices (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    imei VARCHAR(50),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    symptom TEXT NOT NULL,
    repair_cost DECIMAL(10,2) NOT NULL,
    receive_date DATE NOT NULL,
    completed_date DATE,
    return_date DATE,
    status ENUM('pending', 'in-repair', 'completed', 'returned', 'received') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_customer (customer_name, customer_phone),
    INDEX idx_return_date (return_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: accessories
-- ===================================
CREATE TABLE IF NOT EXISTS accessories (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    models TEXT,
    quantity INT DEFAULT 0,
    claim_quantity INT DEFAULT 0,
    cost_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    claim_date DATE,
    note TEXT,
    status ENUM('in-stock', 'claim') DEFAULT 'in-stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_status (store_id, status),
    INDEX idx_code (code),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: equipment
-- ===================================
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    type ENUM('charger-set', 'cable', 'adapter', 'earphone', 'bluetooth', 'screen-protector', 'powerbank', 'speaker', 'case') NOT NULL,
    code VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 0,
    cost_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    import_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store_type (store_id, type),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Views for Statistics
-- ===================================

-- View: Monthly Income by Store
CREATE OR REPLACE VIEW v_monthly_income AS
SELECT 
    store_id,
    DATE_FORMAT(sale_date, '%Y-%m') AS month,
    SUM(CASE WHEN status = 'sold' THEN sale_price ELSE 0 END) AS total_income
FROM (
    SELECT store_id, sale_date, sale_price, status FROM new_devices
    UNION ALL
    SELECT store_id, sale_date, sale_price, status FROM used_devices
) AS all_sales
WHERE sale_date IS NOT NULL
GROUP BY store_id, DATE_FORMAT(sale_date, '%Y-%m');

-- View: Monthly Expenses by Store
CREATE OR REPLACE VIEW v_monthly_expenses AS
SELECT 
    store_id,
    DATE_FORMAT(import_date, '%Y-%m') AS month,
    SUM(purchase_price) AS total_expense
FROM (
    SELECT store_id, import_date, purchase_price FROM new_devices
    UNION ALL
    SELECT store_id, purchase_date AS import_date, purchase_price FROM used_devices
) AS all_purchases
WHERE import_date IS NOT NULL
GROUP BY store_id, DATE_FORMAT(import_date, '%Y-%m');

-- View: Current Stock Summary
CREATE OR REPLACE VIEW v_stock_summary AS
SELECT 
    store_id,
    'new_devices' AS category,
    COUNT(*) AS stock_count,
    SUM(purchase_price) AS total_cost,
    SUM(sale_price) AS potential_income
FROM new_devices
WHERE status = 'stock'
GROUP BY store_id
UNION ALL
SELECT 
    store_id,
    'used_devices' AS category,
    COUNT(*) AS stock_count,
    SUM(purchase_price) AS total_cost,
    SUM(sale_price) AS potential_income
FROM used_devices
WHERE status = 'stock'
GROUP BY store_id;

-- ===================================
-- Stored Procedures
-- ===================================

DELIMITER $$

-- Procedure: Get Dashboard Stats
CREATE PROCEDURE sp_get_dashboard_stats(
    IN p_store_id VARCHAR(50),
    IN p_month VARCHAR(7)
)
BEGIN
    -- New devices stats
    SELECT 
        COUNT(CASE WHEN status = 'stock' THEN 1 END) AS new_devices_stock,
        COUNT(CASE WHEN status = 'sold' AND DATE_FORMAT(sale_date, '%Y-%m') = p_month THEN 1 END) AS new_devices_sold,
        SUM(CASE WHEN status = 'sold' AND DATE_FORMAT(sale_date, '%Y-%m') = p_month THEN sale_price ELSE 0 END) AS new_devices_income
    FROM new_devices
    WHERE store_id = p_store_id;
    
    -- Used devices stats
    SELECT 
        COUNT(CASE WHEN status = 'stock' THEN 1 END) AS used_devices_stock,
        COUNT(CASE WHEN status = 'sold' AND DATE_FORMAT(sale_date, '%Y-%m') = p_month THEN 1 END) AS used_devices_sold,
        SUM(CASE WHEN status = 'sold' AND DATE_FORMAT(sale_date, '%Y-%m') = p_month THEN sale_price ELSE 0 END) AS used_devices_income
    FROM used_devices
    WHERE store_id = p_store_id;
    
    -- Installments stats
    SELECT 
        COUNT(CASE WHEN status = 'active' THEN 1 END) AS installments_active,
        COUNT(CASE WHEN status = 'completed' AND DATE_FORMAT(completed_date, '%Y-%m') = p_month THEN 1 END) AS installments_completed,
        SUM(CASE WHEN status = 'completed' AND DATE_FORMAT(completed_date, '%Y-%m') = p_month THEN sale_price ELSE 0 END) AS installments_income
    FROM installment_devices
    WHERE store_id = p_store_id;
    
    -- Repairs stats
    SELECT 
        COUNT(CASE WHEN status IN ('pending', 'in-repair') THEN 1 END) AS repairs_active,
        COUNT(CASE WHEN status IN ('returned', 'received') AND DATE_FORMAT(return_date, '%Y-%m') = p_month THEN 1 END) AS repairs_completed,
        SUM(CASE WHEN status IN ('returned', 'received') AND DATE_FORMAT(return_date, '%Y-%m') = p_month THEN repair_cost ELSE 0 END) AS repairs_income
    FROM repair_devices
    WHERE store_id = p_store_id;
    
    -- Pawns stats
    SELECT 
        COUNT(CASE WHEN status = 'active' THEN 1 END) AS pawns_active,
        COUNT(CASE WHEN status = 'returned' AND DATE_FORMAT(return_date, '%Y-%m') = p_month THEN 1 END) AS pawns_returned,
        SUM(CASE WHEN status = 'returned' AND DATE_FORMAT(return_date, '%Y-%m') = p_month THEN pawn_amount + interest ELSE 0 END) AS pawns_income
    FROM pawn_devices
    WHERE store_id = p_store_id;
END$$

-- Procedure: Mark Device as Sold
CREATE PROCEDURE sp_mark_device_sold(
    IN p_device_id VARCHAR(50),
    IN p_device_type ENUM('new', 'used'),
    IN p_sale_price DECIMAL(10,2),
    IN p_sale_date DATE
)
BEGIN
    IF p_device_type = 'new' THEN
        UPDATE new_devices 
        SET status = 'sold', sale_price = p_sale_price, sale_date = p_sale_date
        WHERE id = p_device_id;
    ELSE
        UPDATE used_devices 
        SET status = 'sold', sale_price = p_sale_price, sale_date = p_sale_date
        WHERE id = p_device_id;
    END IF;
END$$

-- Procedure: Process Installment Payment
CREATE PROCEDURE sp_process_installment_payment(
    IN p_installment_id VARCHAR(50),
    IN p_payment_date DATE
)
BEGIN
    DECLARE v_installment_amount DECIMAL(10,2);
    DECLARE v_paid_installments INT;
    DECLARE v_total_installments INT;
    
    -- Get installment details
    SELECT installment_amount, paid_installments, total_installments
    INTO v_installment_amount, v_paid_installments, v_total_installments
    FROM installment_devices
    WHERE id = p_installment_id;
    
    -- Insert payment record
    INSERT INTO installment_payments (installment_id, installment_number, payment_date, amount)
    VALUES (p_installment_id, v_paid_installments + 1, p_payment_date, v_installment_amount);
    
    -- Update installment device
    UPDATE installment_devices
    SET paid_installments = v_paid_installments + 1,
        status = CASE 
            WHEN v_paid_installments + 1 >= v_total_installments THEN 'completed'
            ELSE 'active'
        END,
        completed_date = CASE 
            WHEN v_paid_installments + 1 >= v_total_installments THEN p_payment_date
            ELSE completed_date
        END
    WHERE id = p_installment_id;
END$$

DELIMITER ;

-- ===================================
-- Indexes for Performance
-- ===================================

-- Additional composite indexes for common queries
CREATE INDEX idx_new_devices_date_status ON new_devices(sale_date, status);
CREATE INDEX idx_used_devices_date_status ON used_devices(sale_date, status);
CREATE INDEX idx_installments_date_status ON installment_devices(completed_date, status);
CREATE INDEX idx_repairs_date_status ON repair_devices(return_date, status);
CREATE INDEX idx_pawns_date_status ON pawn_devices(return_date, status);

-- ===================================
-- Sample Data (Optional - for testing)
-- ===================================

-- You can uncomment this section to insert sample data

/*
-- Sample New Devices
INSERT INTO new_devices (id, store_id, brand, model, color, ram, rom, imei, purchase_price, sale_price, import_date, status) VALUES
('ND001', 'salaya', 'Apple', 'iPhone 14 Pro', 'Space Black', '6GB', '256GB', '123456789012345', 35000, 42000, '2025-10-01', 'stock'),
('ND002', 'salaya', 'Samsung', 'Galaxy S23', 'Phantom Black', '8GB', '256GB', '123456789012346', 25000, 32000, '2025-10-01', 'stock');

-- Sample Used Devices
INSERT INTO used_devices (id, store_id, brand, model, color, ram, rom, imei, condition_status, purchase_price, sale_price, purchase_date, status) VALUES
('UD001', 'salaya', 'Apple', 'iPhone 13', 'Blue', '4GB', '128GB', '223456789012345', 'ดีมาก', 18000, 24000, '2025-10-01', 'stock');
*/

-- ===================================
-- End of Schema
-- ===================================

