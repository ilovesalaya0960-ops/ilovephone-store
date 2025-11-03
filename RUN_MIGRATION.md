# 🔧 วิธีรัน Migration เพื่อเพิ่มฟิลด์ finance

## ขั้นตอนที่ 1: เปิด MySQL
```bash
# ถ้าใช้ MAMP
# เปิด MAMP แล้วกด "Start Servers"

# ถ้าใช้ Homebrew MySQL
brew services start mysql

# หรือ
mysql.server start
```

## ขั้นตอนที่ 2: รัน Migration

### วิธีที่ 1: ใช้ Script (แนะนำ)
```bash
cd /Users/chakkapong/Sites/ilovephone-store
./add_finance_field.sh
```

### วิธีที่ 2: รันด้วยตัวเอง
```bash
mysql -u root ilovephone_store < /Users/chakkapong/Sites/ilovephone-store/server/migrations/add_finance_field.sql
```

### วิธีที่ 3: ผ่าน MySQL Client
```bash
mysql -u root ilovephone_store
```

แล้วรันคำสั่ง:
```sql
ALTER TABLE installments
ADD COLUMN finance VARCHAR(255) AFTER note;
```

## ตรวจสอบว่าเพิ่มสำเร็จ
```sql
DESCRIBE installments;
```

ควรเห็นคอลัมน์ `finance` ใหม่

## หลังรัน Migration
1. Restart Node.js server
2. Refresh หน้าเว็บ
3. ทดสอบแก้ไขรายการผ่อนใหม่

---

## 🐛 แก้ปัญหา

### ถ้า MySQL ไม่ทำงาน (MAMP)
1. เปิด MAMP
2. กด "Start Servers"
3. รอจนสถานะเป็น "Running"
4. ลองรัน migration อีกครั้ง

### ถ้ามี Error: Access Denied
```bash
# ใช้ user และ password ที่ถูกต้อง
mysql -u root -p ilovephone_store < server/migrations/add_finance_field.sql
```

### ถ้ามี Error: Database not found
```bash
# สร้าง database ก่อน
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ilovephone_store"
```

