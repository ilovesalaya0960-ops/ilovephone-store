-- เพิ่มฟิลด์สำหรับระบุว่าเครื่องขายฝากถูกโยกไปมือสองแล้ว
-- Add fields to track if pawn device was transferred to used devices

ALTER TABLE pawn_devices 
ADD COLUMN transferred_to_used BOOLEAN DEFAULT FALSE COMMENT 'ถูกโยกไปมือสองแล้ว',
ADD COLUMN transferred_date DATE DEFAULT NULL COMMENT 'วันที่โยกไปมือสอง';

-- เพิ่ม index เพื่อความเร็วในการค้นหา
CREATE INDEX idx_transferred ON pawn_devices(transferred_to_used);

-- ตรวจสอบ structure ของ table
DESCRIBE pawn_devices;

