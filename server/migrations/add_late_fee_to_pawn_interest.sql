-- Migration: Add late_fee field to pawn_interest_transactions table
-- Date: 2025-10-30
-- Description: Add late_fee field to support penalty charges for overdue pawn renewals

USE ilovephone_db;

-- First, check if the table exists, if not create it
CREATE TABLE IF NOT EXISTS pawn_interest_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pawn_id VARCHAR(50) NOT NULL,
    interest_amount DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('initial_deduction', 'renewal') NOT NULL,
    transaction_date DATE NOT NULL,
    store ENUM('salaya', 'klongyong') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pawn_id (pawn_id),
    INDEX idx_store (store),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add late_fee field if it doesn't exist
ALTER TABLE pawn_interest_transactions
ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER interest_amount;

-- Add index for late_fee to optimize queries
ALTER TABLE pawn_interest_transactions
ADD INDEX IF NOT EXISTS idx_late_fee (late_fee);

