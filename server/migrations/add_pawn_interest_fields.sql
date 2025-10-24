-- Add interest collection method and redemption amount fields to pawn_devices table
ALTER TABLE pawn_devices 
ADD COLUMN interest_collection_method ENUM('deducted', 'not_deducted') DEFAULT 'not_deducted' AFTER interest,
ADD COLUMN redemption_amount DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER interest_collection_method;

