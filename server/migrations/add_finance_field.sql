-- Add finance column to installments table
ALTER TABLE installments
ADD COLUMN finance VARCHAR(255) AFTER note;

