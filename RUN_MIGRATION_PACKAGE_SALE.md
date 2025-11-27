# Migration: เพิ่มฟิลด์ package_sale ในตาราง simcards

## วัตถุประสงค์
เพิ่มฟิลด์ `package_sale` เพื่อเก็บยอดเติมเงิน/อินเตอร์เน็ต แยกจาก `sale_price`

## โครงสร้างข้อมูล

### ข้อมูลซิมการ์ดที่บันทึก:
| Field | Description | Example | Column |
|-------|-------------|---------|--------|
| ราคาทุนซิม | ราคาที่ซื้อซิมมา | ฿35 | `cost_price` |
| ราคาขายซิม | ราคาที่ขายซิม | ฿50 | `sale_price` |
| ยอดเติม | ยอดเติมเงิน/อินเตอร์เน็ต | ฿100 | `package_sale` |

### การคำนวณ:
- **รายรับ** = `sale_price + package_sale` = 50 + 100 = **฿150**
- **กำไร** = `sale_price - cost_price` = 50 - 35 = **฿15**

---

## วิธีรัน Migration

### ขั้นตอนที่ 1: เชื่อมต่อฐานข้อมูล
```bash
mysql -u root -p ilovephone_db
```

### ขั้นตอนที่ 2: รัน Migration
```sql
source /Users/chakkapong/Sites/ilovephone-store/server/migrations/add_topup_amount_to_simcards.sql
```

หรือใช้คำสั่ง:
```bash
mysql -u root -p ilovephone_db < /Users/chakkapong/Sites/ilovephone-store/server/migrations/add_topup_amount_to_simcards.sql
```

### ขั้นตอนที่ 3: ตรวจสอบผลลัพธ์
```sql
-- ตรวจสอบว่ามี column package_sale แล้ว
DESC simcards;

-- ตรวจสอบ index
SHOW INDEX FROM simcards WHERE Key_name = 'idx_package_sale';
```

## ผลลัพธ์ที่คาดหวัง
```
Field           Type            Null    Key     Default    Extra
...
sale_price      decimal(10,2)   NO              NULL
package_sale    decimal(10,2)   YES             NULL       (ยอดเติมเงิน/อินเตอร์เน็ต)
...
```

---

## การใช้งานหลัง Migration

### 1. เมื่อขายซิมการ์ด
- กรอก: **ประเภท** (เติมเงิน/สมัครอินเตอร์เน็ต)
- กรอก: **ยอดเติม (฿)** เช่น 100
- ระบบจะบันทึก:
  - `cost_price`: 35 (มีอยู่แล้ว)
  - `sale_price`: 50 (มีอยู่แล้ว)
  - `package_sale`: 100 (ยอดที่กรอกใหม่)

### 2. การแสดงผลในตาราง
- แท็บ **ขายแล้ว** จะแสดง: `เติมเงิน (฿100)`
- Format: `[ประเภท] ([ยอดเติม])`

### 3. การคำนวณการ์ด Dashboard
- **รายรับ**: sale_price(50) + package_sale(100) = **฿150**
- **กำไร**: sale_price(50) - cost_price(35) = **฿15**

---

## การทดสอบ

### Test 1: ตรวจสอบ Console Log
เมื่อบันทึกการขาย:
```javascript
[saveSellSimcard] Saving simcard with complete data: {
  cost_price: 35,        // ราคาทุนซิม
  sale_price: 50,        // ราคาขายซิม
  package_sale: 100,     // ยอดเติม ← ต้องมีค่านี้
}
```

### Test 2: Query Database
```sql
SELECT 
    provider,
    phone_number,
    cost_price,      -- ราคาทุน
    sale_price,      -- ราคาขาย
    package_sale,    -- ยอดเติม ← ต้องมี column นี้
    package,         -- ประเภท (เติมเงิน/สมัครอินเตอร์เน็ต)
    status
FROM simcards 
WHERE status = 'sold'
LIMIT 5;
```

**ผลลัพธ์ที่ต้องการ:**
```
+------+------------+-----------+-----------+--------------+--------------+------+
| prov | phone      | cost_price| sale_price| package_sale | package      | stat |
+------+------------+-----------+-----------+--------------+--------------+------+
| DTAC | 0628137727 |     35.00 |     50.00 |       100.00 | เติมเงิน     | sold |
+------+------------+-----------+-----------+--------------+--------------+------+
```

---

## หลังรัน Migration

### 1. Restart Node.js Server
```bash
cd server
npm restart
```
หรือ
```bash
./restart-servers.sh
```

### 2. Hard Refresh Browser
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + F5`

---

## Rollback (ถ้าจำเป็น)
```sql
-- ลบ column package_sale
ALTER TABLE simcards DROP COLUMN package_sale;

-- ลบ index
ALTER TABLE simcards DROP INDEX idx_package_sale;
```

---

## สรุป

✅ ยอดเติม (จาก Modal) บันทึกลง column `package_sale`  
✅ ราคาขายซิม อยู่ใน column `sale_price`  
✅ ราคาทุนซิม อยู่ใน column `cost_price`  
✅ รายรับ = `sale_price + package_sale`  
✅ กำไร = `sale_price - cost_price`
