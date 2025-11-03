# 🔧 แก้ปัญหา Finance และ ยอดจัด (Sale Price) ไม่บันทึก

## 🎯 สาเหตุ
1. **ฟิลด์ `finance` ยังไม่มีในฐานข้อมูล** - ต้องรัน migration
2. **Server ต้อง restart** หลังรัน migration

---

## ✅ ขั้นตอนแก้ไข

### 1️⃣ เปิด MySQL Server
```bash
# ถ้าใช้ MAMP
# เปิด MAMP → กด "Start Servers"

# ถ้าใช้ Homebrew
brew services start mysql
```

### 2️⃣ รัน Migration (เลือก 1 วิธี)

#### วิธีที่ 1: ใช้ Sequel Ace (แนะนำ - ง่ายที่สุด)
1. เปิด Sequel Ace
2. เชื่อมต่อกับ database `ilovephone_store`
3. เปิด SQL Query Editor
4. Copy และรันคำสั่งนี้:

```sql
ALTER TABLE installments
ADD COLUMN finance VARCHAR(255) AFTER note;
```

5. กด Execute (Cmd+R)

#### วิธีที่ 2: ใช้ Terminal
```bash
cd /Users/chakkapong/Sites/ilovephone-store
mysql -u root ilovephone_store < server/migrations/add_finance_field.sql
```

### 3️⃣ ตรวจสอบว่าเพิ่มสำเร็จ
```sql
DESCRIBE installments;
```

ควรเห็นคอลัมน์ `finance` ในรายการ

### 4️⃣ Restart Node.js Server
```bash
# หยุด server (Ctrl+C)
# เริ่มใหม่
cd /Users/chakkapong/Sites/ilovephone-store
node server/server.js
```

### 5️⃣ ทดสอบ
1. Refresh หน้าเว็บ (Cmd+R หรือ F5)
2. เปิดรายการผ่อน → กด แก้ไข
3. กรอกข้อมูลใน **finance** และ **ยอดจัด**
4. กด **บันทึก**
5. เปิด Console (F12) → ดู logs:
   - `🔍 Form data raw values:`
   - `💾 Finance value:`
   - `💾 Sale price value:`
   - `✅ API PUT response:`

---

## 🐛 แก้ปัญหา

### ปัญหา: MySQL Connection Error
```
ERROR 2002 (HY000): Can't connect to MySQL server
```

**แก้:** 
- เปิด MAMP หรือ MySQL server ก่อน
- รอจน status เป็น "Running"

### ปัญหา: Column already exists
```
ERROR 1060: Duplicate column name 'finance'
```

**แก้:** Column มีอยู่แล้ว ข้ามขั้นตอน migration ได้ → ไปขั้นตอนที่ 4 เลย

### ปัญหา: ยังไม่บันทึก
**ตรวจสอบ:**
1. ✅ รัน migration แล้ว?
2. ✅ Restart server แล้ว?
3. ✅ Refresh browser แล้ว?
4. ✅ ดู Console logs มี error ไหม?

---

## 📝 ตัวอย่าง Console Logs ที่ถูกต้อง

```
🔍 Form data raw values:
  - finance: "ระบุข้อมูล finance"
  - salePrice: "6990"
  - costPrice: "4177"
  - downPayment: "2400"

💾 Saving installment:
  downPaymentDate: "2025-11-03"
  nextDueDate: "2025-12-03"
  method: "Next month, same day"

💾 Finance value: ระบุข้อมูล finance
💾 Sale price value: 6990

📝 Updating installment ID: INS1762188646971
✅ API PUT response: { message: "Installment updated successfully" }
```

---

## 📊 ตรวจสอบข้อมูลใน Database

```sql
SELECT id, brand, model, sale_price, finance, updated_at 
FROM installments 
ORDER BY updated_at DESC 
LIMIT 5;
```

ควรเห็น:
- `sale_price` = 6990.00
- `finance` = ระบุข้อมูล finance
- `updated_at` = เวลาล่าสุดที่บันทึก

