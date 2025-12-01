# 🔧 แก้ไข Error: "Data truncated for column 'status'"

## ⚠️ ปัญหา

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
API PUT Error: Error: Data truncated for column 'status' at row 1
Error claiming device: Error: Data truncated for column 'status' at row 1
```

## 🎯 สาเหตุ

คอลัมน์ `status` ในฐานข้อมูลเป็น **ENUM** ที่มีค่า:
```sql
ENUM('stock', 'sold', 'removed')
```

แต่เราพยายามใส่ค่า `'claimed'` ซึ่ง **ยังไม่มีใน ENUM**

---

## ✅ วิธีแก้ไข (3 ขั้นตอน)

### ขั้นตอนที่ 1: รัน Migration ใหม่

**วิธีที่ 1: ใช้ Terminal**
```bash
mysql -u root -p ilovephone_db < server/migrations/add_claim_date_to_devices.sql
```

กรอกรหัผ่าน MySQL แล้วกด Enter

**วิธีที่ 2: ใช้ Sequel Ace**
1. เปิด **Sequel Ace**
2. เชื่อมต่อกับ database: `ilovephone_db`
3. เปิดไฟล์: `server/migrations/add_claim_date_to_devices.sql`
4. **Select All** (Cmd+A)
5. **Run Query** (Cmd+R)
6. ดูผลลัพธ์ด้านล่าง → ต้องเห็น "Query OK" หรือ "0 rows affected"

---

### ขั้นตอนที่ 2: ตรวจสอบ Schema

รัน SQL นี้ใน Sequel Ace:
```sql
DESCRIBE new_devices;
```

ตรวจสอบว่า `status` column เป็น:
```
Field: status
Type: enum('stock','sold','removed','claimed')  ← ต้องมี 'claimed'!
```

ถ้ายังไม่มี 'claimed' ให้รัน Migration อีกครั้ง

---

### ขั้นตอนที่ 3: Refresh Browser

1. กลับไปที่หน้าเว็บ
2. กด **Cmd + Shift + R** (Mac) หรือ **Ctrl + Shift + R** (Windows)
3. ลองเคลมเครื่องอีกครั้ง
4. ✅ ควรทำงานได้แล้ว!

---

## 🧪 ทดสอบว่าแก้แล้ว

1. เปิดหน้าเครื่องมือหนึ่ง
2. ไปที่แท็บ "สต๊อค"
3. เลือกเครื่อง → "เคลม"
4. กด "ตกลง"
5. ระบุวันที่ + หมายเหตุ
6. กด "บันทึกเคลม"
7. ✅ ต้องเห็นข้อความ "บันทึกเคลมสำเร็จ"
8. ✅ เครื่องย้ายไปแท็บ "เคลม"

---

## 📝 คำสั่ง SQL ที่ถูกรัน

Migration file จะรันคำสั่งนี้:

```sql
-- เพิ่ม 'claimed' เข้าไปใน ENUM
ALTER TABLE new_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') DEFAULT 'stock';

ALTER TABLE used_devices 
MODIFY COLUMN status ENUM('stock', 'sold', 'removed', 'claimed') DEFAULT 'stock';

-- เพิ่มคอลัมน์ใหม่
ALTER TABLE new_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL,
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL;

ALTER TABLE used_devices 
ADD COLUMN IF NOT EXISTS claim_date DATE NULL,
ADD COLUMN IF NOT EXISTS claim_note TEXT NULL;
```

---

## ❌ ถ้ายังไม่ได้

### ปัญหา: รัน Migration แล้วแต่ยัง error
**วิธีแก้:**
1. ปิด Terminal/Sequel Ace
2. เปิดใหม่
3. รัน Migration อีกครั้ง
4. ตรวจสอบ schema อีกครั้ง

### ปัญหา: Access denied
**วิธีแก้:**
- ตรวจสอบรหัสผ่าน MySQL
- ลอง: `mysql -u root -p` แล้วใส่รหัสผ่าน

### ปัญหา: Table not found
**วิธีแก้:**
- ตรวจสอบว่า database ชื่อ `ilovephone_db` มีอยู่จริง
- ใช้คำสั่ง: `SHOW DATABASES;`

### ปัญหา: Column already exists
**วิธีแก้:**
- ไม่เป็นไร! คำสั่ง `ADD COLUMN IF NOT EXISTS` จะข้ามไป
- แต่ MODIFY COLUMN status ยังคงทำงาน

---

## 🎯 สาเหตุที่ต้องแก้

### ก่อนแก้:
```sql
status ENUM('stock', 'sold', 'removed')  ← ไม่มี 'claimed'
```

### หลังแก้:
```sql
status ENUM('stock', 'sold', 'removed', 'claimed')  ← มี 'claimed' แล้ว! ✅
```

---

## 📊 ตรวจสอบด้วย SQL Query

```sql
-- ดูว่า ENUM มีอะไรบ้าง
SHOW COLUMNS FROM new_devices LIKE 'status';
SHOW COLUMNS FROM used_devices LIKE 'status';

-- ผลลัพธ์ควรเป็น:
-- Type: enum('stock','sold','removed','claimed')
```

---

## 🎉 สรุป

1. ✅ รัน Migration: `mysql -u root -p ilovephone_db < server/migrations/add_claim_date_to_devices.sql`
2. ✅ ตรวจสอบ Schema: `DESCRIBE new_devices;`
3. ✅ Refresh Browser: Cmd+Shift+R
4. ✅ ทดสอบเคลมอีกครั้ง

**เวลาที่ใช้:** < 2 นาที

**พร้อมใช้งาน:** ✅ YES
