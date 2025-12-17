# การอัพเดท: เพิ่มตัวเลือก iOS/Android ในฟอร์มขายฝาก

## สรุปการเปลี่ยนแปลง

เพิ่มฟีเจอร์ใหม่ในฟอร์ม "เพิ่มรายการขายฝาก" โดยเพิ่มตัวเลือกระบบปฏิบัติการ (iOS/Android)

### ฟีเจอร์ที่เพิ่มเข้ามา:
- ✅ เพิ่มฟิลด์ "ระบบปฏิบัติการ" ให้เลือก iOS หรือ Android
- ✅ เมื่อเลือก iOS จะซ่อนช่องกรอก RAM (เนื่องจาก iOS ไม่มี RAM ให้เลือก)
- ✅ เมื่อเลือก Android จะแสดงช่องกรอก RAM ให้เลือกตามปกติ
- ✅ ระบบจะบันทึกข้อมูลระบบปฏิบัติการในฐานข้อมูล

## ไฟล์ที่มีการเปลี่ยนแปลง

### 1. Frontend (HTML)
- **ไฟล์:** `index.html`
- เพิ่มฟิลด์ "ระบบปฏิบัติการ" ในฟอร์ม pawn
- เพิ่ม `id="pawnRamGroup"` เพื่อจัดการการแสดง/ซ่อนฟิลด์ RAM

### 2. Frontend (JavaScript)
- **ไฟล์:** `script.js`
- เพิ่ม function `togglePawnRamField()` เพื่อจัดการการแสดง/ซ่อนฟิลด์ RAM
- อัพเดท `openPawnModal()` เพื่อรองรับฟิลด์ `os_type`
- อัพเดท `savePawn()` เพื่อบันทึกค่า `os_type` และจัดการ RAM (null สำหรับ iOS)

### 3. Backend API
- **ไฟล์:** `server/routes/pawn.js`
- อัพเดท POST endpoint เพื่อรองรับฟิลด์ `os_type`
- อัพเดท PUT endpoint เพื่อรองรับฟิลด์ `os_type`

### 4. Database Migration
- **ไฟล์:** `server/migrations/add_os_type_to_pawn.sql`
- เพิ่มคอลัมน์ `os_type` ในตาราง `pawn_devices`
- อัพเดทข้อมูลเดิมตามยี่ห้อ (Apple = iOS, อื่นๆ = Android)

## วิธีการติดตั้ง/อัพเดท

### ขั้นตอนที่ 1: รัน Database Migration

เข้าสู่ MySQL และรันคำสั่ง:

```bash
mysql -u root -p ilovephone_store < server/migrations/add_os_type_to_pawn.sql
```

หรือใช้คำสั่ง SQL โดยตรง:

```sql
USE ilovephone_store;

ALTER TABLE pawn_devices 
ADD COLUMN os_type ENUM('ios', 'android') DEFAULT NULL AFTER imei;

UPDATE pawn_devices 
SET os_type = 'ios' 
WHERE LOWER(brand) LIKE '%apple%' OR LOWER(brand) LIKE '%iphone%';

UPDATE pawn_devices 
SET os_type = 'android' 
WHERE os_type IS NULL;
```

### ขั้นตอนที่ 2: Restart Server

```bash
# หยุด server ที่กำลังทำงานอยู่
./stop-servers.sh

# เริ่ม server ใหม่
./start-servers.sh
```

### ขั้นตอนที่ 3: ทดสอบระบบ

1. เปิดเว็บไซต์และไปที่เมนู "ขายฝาก"
2. คลิกปุ่ม "+ เพิ่มรายการขายฝาก"
3. ทดสอบการเลือก iOS และ Android:
   - เลือก "iOS" → ช่อง RAM จะหายไป
   - เลือก "Android" → ช่อง RAM จะแสดง
4. ทดสอบการบันทึกข้อมูลทั้ง iOS และ Android
5. ทดสอบการแก้ไขข้อมูลเดิม

## การทำงานของระบบ

### สำหรับอุปกรณ์ iOS:
- ไม่ต้องเลือก RAM (ฟิลด์จะถูกซ่อน)
- ค่า RAM จะถูกบันทึกเป็น `NULL` ในฐานข้อมูล

### สำหรับอุปกรณ์ Android:
- ต้องเลือก RAM (ฟิลด์จะแสดงและเป็น required)
- ค่า RAM จะถูกบันทึกตามที่เลือก (2GB, 3GB, 4GB, 6GB, 8GB, 12GB, 16GB)

## หมายเหตุ

- ข้อมูลเดิมในระบบจะถูกอัพเดทอัตโนมัติตามยี่ห้อ
- รายการที่มียี่ห้อ "Apple" หรือ "iPhone" จะถูกตั้งเป็น iOS
- รายการอื่นๆ จะถูกตั้งเป็น Android
- ทุกอย่างยังคงทำงานเหมือนเดิม ไม่มีการเปลี่ยนแปลงฟีเจอร์อื่นๆ

## การตรวจสอบว่า Migration สำเร็จหรือไม่

รันคำสั่งนี้ใน MySQL:

```sql
DESCRIBE pawn_devices;
```

ควรเห็นคอลัมน์ `os_type` ที่มี Type เป็น `enum('ios','android')`

---

**วันที่อัพเดท:** 17 ธันวาคม 2025
**เวอร์ชัน:** 1.0.0

