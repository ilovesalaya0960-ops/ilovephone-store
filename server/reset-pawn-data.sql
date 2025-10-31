-- Reset and insert pawn data
DELETE FROM pawn_devices;

INSERT INTO pawn_devices (id, customer_name, brand, model, color, imei, ram, rom, pawn_amount, interest, interest_collection_method, redemption_amount, receive_date, due_date, return_date, seized_date, status, note, store) VALUES
('P1001', NULL, 'Apple', 'iPhone 14 Pro', 'Deep Purple', '358234567895001', '6', '256', 25000, 2500, 'deducted', 25000, '2025-09-25', '2025-10-10', NULL, NULL, 'active', '', 'salaya'),
('P1002', NULL, 'Samsung', 'Galaxy S23 Ultra', 'Phantom Black', '358234567895002', '12', '512', 28000, 2800, 'not_deducted', 30800, '2025-09-28', '2025-10-13', NULL, NULL, 'active', 'ลูกค้าประจำ', 'salaya'),
('P1003', NULL, 'Xiaomi', '13 Pro', 'Ceramic White', '358234567895003', '12', '256', 18000, 1800, 'deducted', 18000, '2025-10-01', '2025-10-16', NULL, NULL, 'active', '', 'salaya'),
('P1004', NULL, 'OPPO', 'Find X6 Pro', 'Black', '358234567895004', '16', '512', 22000, 2200, 'not_deducted', 24200, '2025-09-15', '2025-09-30', '2025-09-29', NULL, 'returned', 'รับคืนตรงเวลา', 'salaya'),
('P1005', NULL, 'Vivo', 'X90 Pro', 'Legend Black', '358234567895005', '12', '256', 20000, 2000, 'not_deducted', 22000, '2025-09-18', '2025-10-03', '2025-10-02', NULL, 'returned', '', 'salaya'),
('P1006', NULL, 'Apple', 'iPhone 13', 'Midnight', '358234567895006', '4', '128', 18000, 1800, 'deducted', 18000, '2025-08-20', '2025-09-04', NULL, '2025-09-15', 'seized', 'เกินกำหนด 11 วัน ติดต่อไม่ได้', 'salaya'),
('P2001', NULL, 'Samsung', 'Galaxy A54', 'Awesome Violet', '358234567895101', '8', '256', 12000, 1200, 'deducted', 12000, '2025-09-30', '2025-10-15', NULL, NULL, 'active', '', 'klongyong'),
('P2002', NULL, 'Realme', 'GT Neo 5', 'Electric Purple', '358234567895102', '12', '256', 10000, 1000, 'not_deducted', 11000, '2025-10-02', '2025-10-17', NULL, NULL, 'active', '', 'klongyong'),
('P2003', NULL, 'OPPO', 'Reno10 Pro', 'Silvery Grey', '358234567895103', '12', '256', 14000, 1400, 'not_deducted', 15400, '2025-09-20', '2025-10-05', '2025-10-04', NULL, 'returned', 'ต่อดอก 1 ครั้งแล้ว', 'klongyong'),
('P2004', NULL, 'Xiaomi', 'Redmi Note 12 Pro', 'Midnight Black', '358234567895104', '8', '256', 8000, 800, 'deducted', 8000, '2025-08-25', '2025-09-09', NULL, '2025-09-20', 'seized', 'ติดต่อไม่ได้', 'klongyong');
