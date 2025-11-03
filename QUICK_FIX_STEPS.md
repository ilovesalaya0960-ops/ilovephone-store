# ⚡ แก้ปัญหาเร่งด่วน: Finance และ ยอดจัด ไม่บันทึก

## 📋 ทำตามลำดับนี้

### 1. เปิด Sequel Ace
- เชื่อมต่อกับ database `ilovephone_store`

### 2. รัน SQL นี้ (Copy ทั้งหมด)
```sql
-- เพิ่มคอลัมน์ finance
ALTER TABLE installments
ADD COLUMN IF NOT EXISTS finance VARCHAR(255) AFTER note;

-- ตรวจสอบว่าเพิ่มแล้ว
DESCRIBE installments;
```

### 3. Restart Node.js Server
**Terminal 1** (หยุด server เก่า):
- กด `Ctrl+C`

**Terminal 2** (เริ่ม server ใหม่):
```bash
cd /Users/chakkapong/Sites/ilovephone-store
node server/server.js
```

### 4. Refresh Browser
- กด `Cmd+R` หรือ `F5`

### 5. ทดสอบ
1. เปิดรายการผ่อน → แก้ไข
2. กรอก **finance** = "test finance"
3. เปลี่ยน **ยอดจัด** = 7000
4. กด **บันทึก**

### 6. ดู Console Logs
**Browser Console (F12):**
```
🔍 Form data raw values:
  - finance: test finance
  - salePrice: 7000
💾 Finance value: test finance
💾 Sale price value: 7000
```

**Server Terminal:**
```
📝 PUT /api/installments/:id - Updating installment: INS...
📝 Key fields:
  finance: 'test finance'
  sale_price: 7000
✅ Update result: 1 row(s) affected
```

---

## ❌ ถ้ายังไม่ได้

### เช็ค 1: Table name ถูกต้องไหม?
```sql
SHOW TABLES LIKE '%installment%';
```

ผลลัพธ์ควรเป็น:
- `installment_devices` ✅ (ถูกต้อง)
- `installments` ❌ (ผิด - ต้องเปลี่ยน)

### เช็ค 2: Column มีจริงไหม?
```sql
SHOW COLUMNS FROM installment_devices LIKE 'finance';
```

ถ้าไม่มี → รัน ALTER TABLE อีกครั้ง

### เช็ค 3: ดูข้อมูลล่าสุด
```sql
SELECT id, brand, model, sale_price, finance, updated_at 
FROM installment_devices 
WHERE id = 'INS1762188646971';
```

ดูว่า `sale_price` และ `finance` update หรือยัง

---

## 🆘 ติดปัญหา?

### Error: Unknown column 'finance'
**สาเหตุ:** Column ยังไม่ได้เพิ่ม  
**แก้:** รัน ALTER TABLE อีกครั้งใน Sequel Ace

### Error: Table 'installments' doesn't exist
**สาเหตุ:** Table name ผิด  
**แก้:** ใช้ `installment_devices` แทน

### ไม่มี Error แต่ไม่บันทึก
**แก้:**
1. Restart server ใหม่
2. Clear browser cache (Cmd+Shift+R)
3. ลองใช้ Incognito mode

---

## 📞 ข้อมูลที่ต้องส่งถ้าติดปัญหา

1. **Browser Console log** (F12)
2. **Server Terminal log**
3. ผลลัพธ์จาก SQL:
```sql
DESCRIBE installment_devices;
```

