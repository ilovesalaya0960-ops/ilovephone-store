# การเพิ่มฟีเจอร์อะไหล่เสียหาย (Damage Feature)

## ขั้นตอนการติดตั้ง

### 1. รัน Migration SQL

ใช้คำสั่งนี้เพื่อเพิ่มคอลัมน์ `damage_quantity` และ `damage_date` ในตาราง `accessories`:

```bash
mysql -u root -p ilovephone_store < server/migrations/add_damage_fields_to_accessories.sql
```

หรือ

```bash
# เข้า MySQL
mysql -u root -p ilovephone_store

# รันคำสั่ง SQL
source server/migrations/add_damage_fields_to_accessories.sql;

# ออกจาก MySQL
exit
```

### 2. ตรวจสอบการเพิ่มคอลัมน์

```bash
mysql -u root -p ilovephone_store -e "DESCRIBE accessories;"
```

ต้องเห็นคอลัมน์ใหม่:
- `damage_quantity` (INT, DEFAULT 0)
- `damage_date` (DATE, DEFAULT NULL)

### 3. รีสตาร์ทเซิร์ฟเวอร์

```bash
cd /Users/chakkapong/Sites/ilovephone-store
./restart-servers.sh
```

## ฟีเจอร์ที่เพิ่มเข้ามา

### หน้า Frontend (index.html)
1. ✅ เพิ่มแท็บ "เสียหาย" ในหน้ารายการอะไหล่
2. ✅ เพิ่ม tab content สำหรับแสดงรายการเสียหาย
3. ✅ เพิ่ม modal สำหรับบันทึกอะไหล่เสียหาย

### Frontend Logic (script.js)
1. ✅ เพิ่ม option "เสียหาย" ใน dropdown การจัดการ
2. ✅ เพิ่มฟังก์ชัน `openDamageModal()` - เปิด modal บันทึกเสียหาย
3. ✅ เพิ่มฟังก์ชัน `closeDamageModal()` - ปิด modal
4. ✅ เพิ่มฟังก์ชัน `sendAccessoryToDamage()` - บันทึกอะไหล่เสียหาย
5. ✅ เพิ่มฟังก์ชัน `displayDamageAccessories()` - แสดงรายการเสียหาย
6. ✅ อัปเดต `loadAccessoriesData()` - โหลดและแสดงข้อมูลเสียหาย
7. ✅ เพิ่ม API endpoint `accessoryDamage`

### Backend API (server/routes/accessories.js)
1. ✅ เพิ่ม POST `/api/accessories/:id/damage` - บันทึกอะไหล่เสียหาย
2. ✅ อัปเดต PUT `/api/accessories/:id` - รองรับ damage_quantity และ damage_date

### Database Migration
1. ✅ เพิ่มคอลัมน์ `damage_quantity` (INT, DEFAULT 0)
2. ✅ เพิ่มคอลัมน์ `damage_date` (DATE)

## วิธีใช้งาน

1. เปิดหน้ารายการอะไหล่
2. เลือกแท็บอะไหล่ที่ต้องการ (แบตเตอรี่, จอ, ฯลฯ)
3. คลิก dropdown "-- เลือกการจัดการ --"
4. เลือก "เสียหาย"
5. กรอกจำนวนที่เสียหายและวันที่
6. คลิก "บันทึกเสียหาย"
7. ไปดูรายการที่แท็บ "เสียหาย"

## หมายเหตุ

- อะไหล่ที่มีสถานะเสียหายจะยังคงนับรวมในจำนวนคงเหลือ แต่จะแสดงแยกในแท็บเสียหาย
- จำนวนเสียหายจะถูกหักออกจากจำนวนที่สามารถใช้งานได้
- สามารถแก้ไขข้อมูลอะไหล่ที่เสียหายได้ผ่านปุ่ม "แก้ไข"

## เสร็จสิ้น! ✅

ระบบพร้อมใช้งานแล้ว

