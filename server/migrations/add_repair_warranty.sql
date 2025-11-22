-- Add warranty field to repairs table

ALTER TABLE repairs
ADD COLUMN warranty INT DEFAULT NULL COMMENT 'ระยะเวลารับประกัน (วัน): 7, 30, 90, 180, 365';

