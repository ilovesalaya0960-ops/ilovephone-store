-- Migration: Add detailed customer information fields for store installments
-- Created: 2025-01-17
-- Description: เพิ่มฟิลด์ข้อมูลลูกค้าแบบละเอียดสำหรับผ่อนร้าน

-- เพิ่มคอลัมน์ข้อมูลลูกค้าพื้นฐาน
ALTER TABLE installment_devices ADD COLUMN customer_type VARCHAR(50) DEFAULT 'thai' COMMENT 'ประเภทลูกค้า: thai, foreigner';
ALTER TABLE installment_devices ADD COLUMN customer_full_name VARCHAR(255) COMMENT 'ชื่อเต็มของลูกค้า';
ALTER TABLE installment_devices ADD COLUMN customer_phone_store VARCHAR(20) COMMENT 'เบอร์โทรศัพท์';
ALTER TABLE installment_devices ADD COLUMN customer_work_phone VARCHAR(20) COMMENT 'เบอร์โทรศัพท์ที่ทำงาน';
ALTER TABLE installment_devices ADD COLUMN customer_email VARCHAR(255) COMMENT 'อีเมล';
ALTER TABLE installment_devices ADD COLUMN customer_line_id VARCHAR(100) COMMENT 'ไอดีไลน์';
ALTER TABLE installment_devices ADD COLUMN customer_gender VARCHAR(50) COMMENT 'เพศลูก';
ALTER TABLE installment_devices ADD COLUMN customer_id_attach_fee DECIMAL(10,2) DEFAULT 0 COMMENT 'ค่าแนบประชาชน';
ALTER TABLE installment_devices ADD COLUMN customer_id_number VARCHAR(50) COMMENT 'บัตรประชาชน';
ALTER TABLE installment_devices ADD COLUMN customer_birthdate DATE COMMENT 'วันเกิด';

-- บุคคลเกี่ยวข้อง (2 คน)
ALTER TABLE installment_devices ADD COLUMN contact1_name VARCHAR(255) COMMENT 'บุคคลที่ 1: ชื่อ-สกุล';
ALTER TABLE installment_devices ADD COLUMN contact1_relation VARCHAR(100) COMMENT 'บุคคลที่ 1: ความสัมพันธ์กับผู้กู้';
ALTER TABLE installment_devices ADD COLUMN contact1_phone VARCHAR(20) COMMENT 'บุคคลที่ 1: เบอร์โทร';
ALTER TABLE installment_devices ADD COLUMN contact2_name VARCHAR(255) COMMENT 'บุคคลที่ 2: ชื่อ-สกุล';
ALTER TABLE installment_devices ADD COLUMN contact2_relation VARCHAR(100) COMMENT 'บุคคลที่ 2: ความสัมพันธ์กับผู้กู้';
ALTER TABLE installment_devices ADD COLUMN contact2_phone VARCHAR(20) COMMENT 'บุคคลที่ 2: เบอร์โทร';

-- ที่อยู่ตามบัตรประชาชน
ALTER TABLE installment_devices ADD COLUMN id_address_house_no VARCHAR(255) COMMENT 'ที่อยู่บัตร: บ้านเลขที่';
ALTER TABLE installment_devices ADD COLUMN id_address_province VARCHAR(100) COMMENT 'ที่อยู่บัตร: จังหวัด';
ALTER TABLE installment_devices ADD COLUMN id_address_district VARCHAR(100) COMMENT 'ที่อยู่บัตร: อำเภอ';
ALTER TABLE installment_devices ADD COLUMN id_address_subdistrict VARCHAR(100) COMMENT 'ที่อยู่บัตร: ตำบล';

-- ที่อยู่ปัจจุบัน
ALTER TABLE installment_devices ADD COLUMN current_address_house_no VARCHAR(255) COMMENT 'ที่อยู่ปัจจุบัน: บ้านเลขที่';
ALTER TABLE installment_devices ADD COLUMN current_address_province VARCHAR(100) COMMENT 'ที่อยู่ปัจจุบัน: จังหวัด';
ALTER TABLE installment_devices ADD COLUMN current_address_district VARCHAR(100) COMMENT 'ที่อยู่ปัจจุบัน: อำเภอ';
ALTER TABLE installment_devices ADD COLUMN current_address_subdistrict VARCHAR(100) COMMENT 'ที่อยู่ปัจจุบัน: ตำบล';

-- ที่อยู่ทำงาน
ALTER TABLE installment_devices ADD COLUMN work_address_house_no VARCHAR(255) COMMENT 'ที่อยู่ทำงาน: บ้านเลขที่';
ALTER TABLE installment_devices ADD COLUMN work_address_province VARCHAR(100) COMMENT 'ที่อยู่ทำงาน: จังหวัด';
ALTER TABLE installment_devices ADD COLUMN work_address_district VARCHAR(100) COMMENT 'ที่อยู่ทำงาน: อำเภอ';
ALTER TABLE installment_devices ADD COLUMN work_address_subdistrict VARCHAR(100) COMMENT 'ที่อยู่ทำงาน: ตำบล';

-- หมายเหตุ
ALTER TABLE installment_devices ADD COLUMN customer_notes TEXT COMMENT 'หมายเหตุเพิ่มเติม';

-- สร้าง index สำหรับการค้นหา
CREATE INDEX idx_customer_id_number ON installment_devices(customer_id_number);
CREATE INDEX idx_customer_phone_store ON installment_devices(customer_phone_store);

