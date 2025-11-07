-- Migration: Fix repairs table schema to match API and Frontend
-- Date: 2025-11-06
-- Description: 
--   1. Rename table from repair_devices to repairs (or create repairs table)
--   2. Add missing columns: store, problem, received_date, returned_date, seized_date, appointment_date
--   3. Make customer_name and customer_phone nullable
--   4. Rename columns: symptom -> problem, receive_date -> received_date, return_date -> returned_date

-- Note: Database name will be set by the shell script or MySQL client
-- Do not use USE statement here - let the caller specify the database

-- Step 1: Check if repairs table exists, if not create it
CREATE TABLE IF NOT EXISTS repairs (
    id VARCHAR(50) PRIMARY KEY,
    store VARCHAR(50),
    store_id VARCHAR(50),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    imei VARCHAR(50),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    problem TEXT,
    symptom TEXT,
    repair_cost DECIMAL(10,2) NOT NULL,
    received_date DATE,
    receive_date DATE,
    appointment_date DATE,
    completed_date DATE,
    returned_date DATE,
    return_date DATE,
    seized_date DATE,
    status ENUM('pending', 'in-repair', 'completed', 'returned', 'received', 'seized') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store_status (store, status),
    INDEX idx_customer (customer_name, customer_phone),
    INDEX idx_returned_date (returned_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Migrate data from repair_devices to repairs (if repair_devices exists)
-- Note: Run this manually if repair_devices table exists
-- INSERT INTO repairs (
--     id, store_id, brand, model, color, imei, customer_name, customer_phone,
--     symptom, problem, repair_cost, receive_date, received_date, completed_date,
--     return_date, returned_date, status, note, created_at, updated_at
-- )
-- SELECT 
--     id, store_id, brand, model, color, imei, customer_name, customer_phone,
--     symptom, symptom as problem, repair_cost, receive_date, receive_date as received_date,
--     completed_date, return_date, return_date as returned_date, status, note,
--     created_at, updated_at
-- FROM repair_devices
-- WHERE NOT EXISTS (SELECT 1 FROM repairs WHERE repairs.id = repair_devices.id);

-- Step 3: Migrate store from store_id (store_id should be 'salaya' or 'khlongyong')
-- If store_id exists, copy it to store column
-- Only run if store_id column exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'repairs' 
    AND COLUMN_NAME = 'store_id');

SET @preparedStatement = IF(@column_exists > 0,
    'UPDATE repairs SET store = store_id WHERE (store IS NULL OR store = \"\") AND store_id IS NOT NULL',
    'SELECT 1'
);
PREPARE migrateStore FROM @preparedStatement;
EXECUTE migrateStore;
DEALLOCATE PREPARE migrateStore;

-- Step 4: Copy problem from symptom if problem is NULL
-- Only run if symptom column exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'repairs' 
    AND COLUMN_NAME = 'symptom');

SET @preparedStatement = IF(@column_exists > 0,
    'UPDATE repairs SET problem = symptom WHERE problem IS NULL AND symptom IS NOT NULL',
    'SELECT 1'
);
PREPARE migrateProblem FROM @preparedStatement;
EXECUTE migrateProblem;
DEALLOCATE PREPARE migrateProblem;

-- Step 5: Copy received_date from receive_date if received_date is NULL
-- Only run if receive_date column exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'repairs' 
    AND COLUMN_NAME = 'receive_date');

SET @preparedStatement = IF(@column_exists > 0,
    'UPDATE repairs SET received_date = receive_date WHERE received_date IS NULL AND receive_date IS NOT NULL',
    'SELECT 1'
);
PREPARE migrateReceivedDate FROM @preparedStatement;
EXECUTE migrateReceivedDate;
DEALLOCATE PREPARE migrateReceivedDate;

-- Step 6: Copy returned_date from return_date if returned_date is NULL
-- Only run if return_date column exists
SET @column_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'repairs' 
    AND COLUMN_NAME = 'return_date');

SET @preparedStatement = IF(@column_exists > 0,
    'UPDATE repairs SET returned_date = return_date WHERE returned_date IS NULL AND return_date IS NOT NULL',
    'SELECT 1'
);
PREPARE migrateReturnedDate FROM @preparedStatement;
EXECUTE migrateReturnedDate;
DEALLOCATE PREPARE migrateReturnedDate;

-- Step 7: Add missing columns if not exist
SET @dbname = DATABASE();
SET @tablename = 'repairs';

-- Add store column
SET @columnname = 'store';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(50) AFTER store_id')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add problem column
SET @columnname = 'problem';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT AFTER symptom')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add received_date column
SET @columnname = 'received_date';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE AFTER receive_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add returned_date column
SET @columnname = 'returned_date';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE AFTER return_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add seized_date column
SET @columnname = 'seized_date';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE AFTER returned_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add appointment_date column
SET @columnname = 'appointment_date';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE AFTER received_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 8: Make customer_name and customer_phone nullable
ALTER TABLE repairs MODIFY COLUMN customer_name VARCHAR(100) NULL;
ALTER TABLE repairs MODIFY COLUMN customer_phone VARCHAR(20) NULL;

-- Step 9: Add 'seized' to status enum if not exists
ALTER TABLE repairs MODIFY COLUMN status ENUM('pending', 'in-repair', 'completed', 'returned', 'received', 'seized') DEFAULT 'pending';

-- Verification queries (run these to check):
-- SELECT id, store, store_id, customer_name, customer_phone, problem, symptom, received_date, receive_date FROM repairs LIMIT 5;

