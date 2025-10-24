# Pawn Interest & Redemption Amount Update

## สรุปการอัพเดท

ได้ทำการอัพเดทระบบขายฝากตามที่ร้องขอ:

### 1. คำนวณดอกเบี้ยอัตโนมัติ (10%)
- เมื่อกรอก "ยอดขายฝาก" ระบบจะคำนวณดอกเบี้ย 10% โดยอัตโนมัติ
- ช่องดอกเบี้ยเป็น readonly ไม่สามารถแก้ไขด้วยตนเองได้

### 2. เพิ่มช่อง "ช่องเก็บดอกเบี้ย"
มี 2 ตัวเลือก:
- **หักดอก**: ยอดไถ่ถอน = ยอดขายฝาก (เท่ากัน)
- **ยังไม่หักดอก**: ยอดไถ่ถอน = ยอดขายฝาก + ดอกเบี้ย

### 3. เพิ่มช่อง "ยอดไถ่ถอน"
- คำนวณอัตโนมัติตามการเลือกวิธีการเก็บดอกเบี้ย
- เป็น readonly ไม่สามารถแก้ไขด้วยตนเองได้

## ไฟล์ที่มีการเปลี่ยนแปลง

### 1. Database Migration
- `server/migrations/add_pawn_interest_fields.sql` - เพิ่มคอลัมน์ใหม่ในฐานข้อมูล

### 2. Frontend (HTML)
- `index.html` - เพิ่มฟิลด์ใหม่ในฟอร์ม และอัพเดทตารางแสดงผล

### 3. Frontend (JavaScript)
- `script.js` - เพิ่มฟังก์ชันคำนวณ:
  - `calculatePawnInterest()` - คำนวณดอกเบี้ย 10%
  - `calculateRedemptionAmount()` - คำนวณยอดไถ่ถอน

### 4. Backend
- `server/routes/pawn.js` - อัพเดท API รองรับฟิลด์ใหม่

## วิธีการติดตั้ง

### ขั้นตอนที่ 1: อัพเดทฐานข้อมูล

เปิด MySQL และรันคำสั่ง:

```bash
mysql -u root -p ilovephone_store < server/migrations/add_pawn_interest_fields.sql
```

หรือเข้า MySQL แล้วรันคำสั่ง SQL:

```sql
USE ilovephone_store;

ALTER TABLE pawn_devices 
ADD COLUMN interest_collection_method ENUM('deducted', 'not_deducted') DEFAULT 'not_deducted' AFTER interest,
ADD COLUMN redemption_amount DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER interest_collection_method;
```

### ขั้นตอนที่ 2: รีสตาร์ทเซิร์ฟเวอร์ Node.js

```bash
cd server
npm restart
```

หรือหยุดและเริ่มใหม่:

```bash
cd server
# หยุดเซิร์ฟเวอร์ (Ctrl+C)
npm start
```

### ขั้นตอนที่ 3: ทดสอบระบบ

1. เปิดเว็บไซต์
2. ไปที่แท็บ "ขายฝาก"
3. คลิก "เพิ่มรายการขายฝาก"
4. ลองกรอกข้อมูล:
   - กรอกยอดขายฝาก เช่น 10000
   - ระบบจะแสดงดอกเบี้ย 1000 อัตโนมัติ (10%)
   - เลือกช่องเก็บดอกเบี้ย:
     - เลือก "หักดอก" → ยอดไถ่ถอนแสดง 10000
     - เลือก "ยังไม่หักดอก" → ยอดไถ่ถอนแสดง 11000

## โครงสร้างฐานข้อมูลใหม่

```sql
pawn_devices
├── ... (ฟิลด์เดิม)
├── pawn_amount DECIMAL(10,2)
├── interest DECIMAL(10,2)
├── interest_collection_method ENUM('deducted', 'not_deducted') [ใหม่]
├── redemption_amount DECIMAL(10,2) [ใหม่]
└── ... (ฟิลด์เดิมต่อ)
```

## หมายเหตุ

- ข้อมูลเดิมในฐานข้อมูลจะมีค่า `interest_collection_method` เป็น 'not_deducted' และ `redemption_amount` เป็น 0 โดยอัตโนมัติ
- สามารถแก้ไขข้อมูลเก่าได้โดยคลิก "แก้ไข" แล้วบันทึกใหม่
- ตารางแสดงผลทุกตารางได้รับการอัพเดทให้แสดงฟิลด์ใหม่แล้ว:
  - เครื่องขายฝากที่ยังไม่รับคืน (Active)
  - เครื่องที่รับคืนแล้ว (Returned)
  - เครื่องที่ยึดแล้ว (Seized)
  - ตารางรายละเอียดค่าใช้จ่าย (Expense Details)

## การทำงานของระบบ

1. **ช่องยอดขายฝาก**: กรอกตัวเลข
2. **ช่องดอกเบี้ย**: คำนวณอัตโนมัติ (10% ของยอดขายฝาก)
3. **ช่องเก็บดอกเบี้ย**: เลือก "หักดอก" หรือ "ยังไม่หักดอก"
4. **ช่องยอดไถ่ถอน**: คำนวณอัตโนมัติตามการเลือก:
   - หักดอก: ยอดไถ่ถอน = ยอดขายฝาก
   - ยังไม่หักดอก: ยอดไถ่ถอน = ยอดขายฝาก + ดอกเบี้ย

