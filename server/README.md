# iLovePhone Management System - Backend Server

REST API backend server สำหรับระบบจัดการร้านมือถือ

## เทคโนโลยีที่ใช้

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MySQL** - Database
- **mysql2** - MySQL Client

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd server
npm install
```

### 2. ตั้งค่า Database

สร้าง Database และ Import schema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ilovephone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ilovephone_db;
SOURCE database.sql;
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ilovephone_db
PORT=3000
```

### 4. เริ่มต้น Server

```bash
npm start
```

Server จะทำงานที่ `http://localhost:3000`

## API Endpoints

### New Devices (เครื่องใหม่)

- `GET /api/new-devices` - ดึงรายการเครื่องใหม่ทั้งหมด
- `GET /api/new-devices/:id` - ดึงข้อมูลเครื่องใหม่ตาม ID
- `POST /api/new-devices` - เพิ่มเครื่องใหม่
- `PUT /api/new-devices/:id` - แก้ไขข้อมูลเครื่องใหม่
- `DELETE /api/new-devices/:id` - ลบเครื่องใหม่
- `GET /api/new-devices/stats/summary` - สถิติเครื่องใหม่

### Used Devices (เครื่องมือสอง)

- `GET /api/used-devices` - ดึงรายการเครื่องมือสองทั้งหมด
- `GET /api/used-devices/:id` - ดึงข้อมูลเครื่องมือสองตาม ID
- `POST /api/used-devices` - เพิ่มเครื่องมือสอง
- `PUT /api/used-devices/:id` - แก้ไขข้อมูลเครื่องมือสอง
- `DELETE /api/used-devices/:id` - ลบเครื่องมือสอง

### Repairs (ซ่อม)

- `GET /api/repairs` - ดึงรายการซ่อมทั้งหมด
- `POST /api/repairs` - เพิ่มรายการซ่อม
- `PUT /api/repairs/:id` - แก้ไขรายการซ่อม
- `DELETE /api/repairs/:id` - ลบรายการซ่อม

### Installments (ผ่อนชำระ)

- `GET /api/installments` - ดึงรายการผ่อนชำระทั้งหมด (พร้อมประวัติการชำระ)
- `POST /api/installments` - เพิ่มรายการผ่อนชำระ
- `POST /api/installments/:id/payment` - บันทึกการชำระเงิน
- `DELETE /api/installments/:id` - ลบรายการผ่อนชำระ

### Pawn (รับจำนำ)

- `GET /api/pawn` - ดึงรายการรับจำนำทั้งหมด
- `POST /api/pawn` - เพิ่มรายการรับจำนำ
- `PUT /api/pawn/:id` - แก้ไขรายการรับจำนำ
- `DELETE /api/pawn/:id` - ลบรายการรับจำนำ

### Accessories (อะไหล่)

- `GET /api/accessories` - ดึงรายการอะไหล่ทั้งหมด
- `GET /api/accessories/:id` - ดึงข้อมูลอะไหล่ตาม ID
- `POST /api/accessories` - เพิ่มอะไหล่
- `PUT /api/accessories/:id` - แก้ไขอะไหล่
- `DELETE /api/accessories/:id` - ลบอะไหล่

### Equipment (อุปกรณ์)

- `GET /api/equipment` - ดึงรายการอุปกรณ์ทั้งหมด
- `GET /api/equipment/:id` - ดึงข้อมูลอุปกรณ์ตาม ID
- `POST /api/equipment` - เพิ่มอุปกรณ์
- `PUT /api/equipment/:id` - แก้ไขอุปกรณ์
- `DELETE /api/equipment/:id` - ลบอุปกรณ์

## Query Parameters

ทุก GET endpoint รองรับ filter:

- `?store=salaya` - กรองตามสาขาศาลายา
- `?store=klongyong` - กรองตามสาขาคลองโยง

ตัวอย่าง:
```
GET /api/new-devices?store=salaya
GET /api/repairs?store=klongyong
```

## ตัวอย่างการใช้งาน API

### เพิ่มเครื่องใหม่

```javascript
fetch('http://localhost:3000/api/new-devices', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 'N001',
        brand: 'iPhone',
        model: '15 Pro Max',
        color: 'Natural Titanium',
        imei: '123456789012345',
        ram: '8GB',
        rom: '256GB',
        purchase_price: 42000,
        import_date: '2024-01-15',
        status: 'stock',
        store: 'salaya'
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

### บันทึกการชำระผ่อน

```javascript
fetch('http://localhost:3000/api/installments/I001/payment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        installment_number: 1,
        payment_date: '2024-02-01',
        amount: 2000
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

### ดึงสถิติเครื่องใหม่

```javascript
fetch('http://localhost:3000/api/new-devices/stats/summary?store=salaya')
    .then(res => res.json())
    .then(stats => {
        console.log('ยอดขาย:', stats.total_revenue);
        console.log('กำไร:', stats.total_profit);
        console.log('สต๊อก:', stats.stock_count);
    });
```

## Database Schema

ดูรายละเอียด schema ได้ที่ไฟล์ `database.sql`

### ตารางหลัก

1. **new_devices** - เครื่องใหม่
2. **used_devices** - เครื่องมือสอง
3. **repairs** - รายการซ่อม
4. **installment_devices** - รายการผ่อนชำระ
5. **installment_payments** - ประวัติการชำระเงิน
6. **pawn_devices** - รายการรับจำนำ
7. **accessories** - อะไหล่
8. **equipment** - อุปกรณ์

## Error Handling

API จะส่ง response ในรูปแบบ:

**Success:**
```json
{
    "message": "Operation successful"
}
```

**Error:**
```json
{
    "error": "Error message description"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Server Error

## License

MIT
