# แก้ไขปัญหา: ยอดเติมไม่ถูกบันทึกลง column package_sale

## ปัญหา
ยอดเติมที่กรอกใน Modal "ขายซิมการ์ด" ไม่ถูกบันทึกลง column `package_sale` ใน database

## สาเหตุที่เป็นไปได้
1. ❌ Column `package_sale` ยังไม่มีในตาราง `simcards`
2. ❌ ยังไม่ได้รัน Migration
3. ❌ Server route ไม่ได้รับค่า `package_sale`

---

## วิธีแก้ไข (ทำตามขั้นตอน)

### ขั้นตอนที่ 1: ตรวจสอบและเพิ่ม Column

เปิด Terminal และรันคำสั่ง:

```bash
mysql -u root -p ilovephone_db < /Users/chakkapong/Sites/ilovephone-store/check-and-fix-simcard-schema.sql
```

หรือเข้า MySQL แบบ interactive:

```bash
mysql -u root -p ilovephone_db
```

แล้วรันคำสั่งทีละคำสั่ง:

```sql
-- 1. ตรวจสอบว่ามี column package_sale หรือยัง
DESC simcards;
```

**ดูที่คอลัมน์ `package_sale`:**
- ✅ **ถ้ามี**: จะเห็น `package_sale` ในรายการ
- ❌ **ถ้าไม่มี**: ไปขั้นตอนถัดไป

```sql
-- 2. เพิ่ม column package_sale (ถ้ายังไม่มี)
ALTER TABLE simcards 
ADD COLUMN package_sale DECIMAL(10,2) NULL 
    COMMENT 'ยอดเติมเงิน/อินเตอร์เน็ต (แยกจาก sale_price)' 
    AFTER sale_price;
```

```sql
-- 3. ตรวจสอบอีกครั้ง
DESC simcards;
```

**ผลลัพธ์ที่ต้องการเห็น:**
```
+--------------+---------------+------+-----+---------+-------+
| Field        | Type          | Null | Key | Default | Extra |
+--------------+---------------+------+-----+---------+-------+
| ...          | ...           | ...  | ... | ...     | ...   |
| sale_price   | decimal(10,2) | NO   |     | NULL    |       |
| package_sale | decimal(10,2) | YES  |     | NULL    |       | ← ต้องมีบรรทัดนี้
| ...          | ...           | ...  | ... | ...     | ...   |
+--------------+---------------+------+-----+---------+-------+
```

---

### ขั้นตอนที่ 2: Restart Server

```bash
cd /Users/chakkapong/Sites/ilovephone-store
./restart-servers.sh
```

หรือ:

```bash
cd server
npm restart
```

---

### ขั้นตอนที่ 3: Hard Refresh Browser

- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + F5`

---

### ขั้นตอนที่ 4: ทดสอบการบันทึก

1. เปิด Browser Console (`F12`)
2. ไปหน้า **ซิมการ์ด**
3. เลือกซิม → **ขาย**
4. กรอกข้อมูล:
   - ประเภท: เติมเงิน
   - **ยอดเติม: 100**
   - วันที่ขาย: วันนี้
5. กด **บันทึก**

**ตรวจสอบ Console:**
```javascript
[saveSellSimcard] Saving simcard with complete data: {
  cost_price: 35,
  sale_price: 50,
  package_sale: 100,    // ← ต้องมีค่านี้
}
```

---

### ขั้นตอนที่ 5: ตรวจสอบใน Database

```sql
-- ตรวจสอบข้อมูลที่เพิ่งบันทึก
SELECT 
    id,
    provider,
    phone_number,
    cost_price,
    sale_price,
    package_sale,     -- ← ต้องมีค่า 100
    package,
    status,
    sale_date
FROM simcards 
WHERE status = 'sold'
ORDER BY sale_date DESC
LIMIT 3;
```

**ผลลัพธ์ที่ต้องการ:**
```
+----------+------+------------+-----------+-----------+--------------+----------+------+------------+
| id       | prov | phone      | cost_price| sale_price| package_sale | package  | stat | sale_date  |
+----------+------+------------+-----------+-----------+--------------+----------+------+------------+
| SIM-123  | DTAC | 0628137727 |     35.00 |     50.00 |       100.00 | เติมเงิน | sold | 2025-11-26 |
+----------+------+------------+-----------+-----------+--------------+----------+------+------------+
                                                              ↑ ต้องมีค่า 100
```

---

## การตรวจสอบเพิ่มเติม

### 1. ตรวจสอบ Network Request

เปิด **Developer Tools** → **Network** → กดขายซิม → ดู Request Payload:

```json
{
  "id": "SIM-123",
  "cost_price": 35,
  "sale_price": 50,
  "package_sale": 100,    // ← ต้องส่งค่านี้ไปด้วย
  "status": "sold",
  "package": "เติมเงิน"
}
```

### 2. ตรวจสอบ Server Log

```bash
# ถ้ามี error จะแสดงใน console
cd server
npm start
```

ดูว่ามี error เกี่ยวกับ `package_sale` หรือไม่

---

## สาเหตุที่อาจทำให้ยังไม่บันทึก

### ❌ ปัญหา 1: Column ยังไม่มี
**วิธีแก้**: รันคำสั่ง ALTER TABLE ตามขั้นตอนที่ 1

### ❌ ปัญหา 2: Server ยังไม่ Restart
**วิธีแก้**: Restart server ตามขั้นตอนที่ 2

### ❌ ปัญหา 3: Browser Cache
**วิธีแก้**: Hard refresh ตามขั้นตอนที่ 3

### ❌ ปัญหา 4: MySQL Version ไม่รองรับ `IF NOT EXISTS`
ถ้า MySQL version เก่า ให้ใช้คำสั่งนี้แทน:

```sql
-- ตรวจสอบก่อนว่ามี column หรือยัง
SELECT COUNT(*) 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ilovephone_db' 
  AND TABLE_NAME = 'simcards'
  AND COLUMN_NAME = 'package_sale';

-- ถ้าได้ 0 (ไม่มี) ให้รันคำสั่งนี้:
ALTER TABLE simcards 
ADD COLUMN package_sale DECIMAL(10,2) NULL 
COMMENT 'ยอดเติมเงิน/อินเตอร์เน็ต (แยกจาก sale_price)' 
AFTER sale_price;
```

---

## คำสั่งด่วน (Quick Commands)

```bash
# 1. เพิ่ม column
mysql -u root -p ilovephone_db -e "ALTER TABLE simcards ADD COLUMN package_sale DECIMAL(10,2) NULL COMMENT 'ยอดเติมเงิน/อินเตอร์เน็ต' AFTER sale_price;"

# 2. ตรวจสอบว่าเพิ่มสำเร็จ
mysql -u root -p ilovephone_db -e "DESC simcards;"

# 3. Restart server
cd /Users/chakkapong/Sites/ilovephone-store && ./restart-servers.sh
```

---

## สรุป Checklist

- [ ] เข้า MySQL
- [ ] รันคำสั่ง `DESC simcards;` ตรวจสอบว่ามี `package_sale`
- [ ] ถ้าไม่มี รัน ALTER TABLE เพิ่ม column
- [ ] ตรวจสอบอีกครั้งว่ามี column แล้ว
- [ ] Restart server
- [ ] Hard refresh browser
- [ ] ทดสอบขายซิมใหม่
- [ ] ตรวจสอบ Console log
- [ ] Query database ดูว่ามีค่า package_sale

---

**หมายเหตุ**: ถ้ายังมีปัญหา ให้ส่ง screenshot console log และผลลัพธ์จาก `DESC simcards;` มาดูครับ


