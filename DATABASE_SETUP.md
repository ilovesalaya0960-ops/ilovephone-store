# การติดตั้งและใช้งานฐานข้อมูล MySQL
## ระบบจัดการร้านมือถือ

---

## 📋 สารบัญ
1. [ความต้องการของระบบ](#ความต้องการของระบบ)
2. [การติดตั้งฐานข้อมูล](#การติดตั้งฐานข้อมูล)
3. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
4. [การเชื่อมต่อฐานข้อมูล](#การเชื่อมต่อฐานข้อมูล)
5. [การใช้งาน API](#การใช้งาน-api)

---

## 🔧 ความต้องการของระบบ

### Software Requirements:
- **MySQL Server**: 5.7 ขึ้นไป หรือ MariaDB 10.2 ขึ้นไป
- **PHP**: 7.4 ขึ้นไป (สำหรับ API)
- **Web Server**: Apache หรือ Nginx
- **phpMyAdmin**: (ไม่บังคับ แต่แนะนำสำหรับจัดการฐานข้อมูล)

### แนะนำให้ใช้:
- **XAMPP** (Windows/Mac/Linux): [Download](https://www.apachefriends.org/)
- **MAMP** (Mac): [Download](https://www.mamp.info/)
- **WAMP** (Windows): [Download](https://www.wampserver.com/)

---

## 📦 การติดตั้งฐานข้อมูล

### วิธีที่ 1: ใช้ phpMyAdmin (แนะนำสำหรับผู้เริ่มต้น)

1. เปิด phpMyAdmin (`http://localhost/phpmyadmin`)
2. คลิกแท็บ "SQL"
3. คัดลอกเนื้อหาจากไฟล์ `database.sql`
4. วางในช่อง SQL แล้วคลิก "Go"

### วิธีที่ 2: ใช้ Command Line

```bash
# เข้าสู่ระบบ MySQL
mysql -u root -p

# หรือถ้าไม่มีรหัสผ่าน
mysql -u root

# Import ไฟล์ SQL
mysql -u root -p < database.sql

# หรือภายใน MySQL shell
source /path/to/database.sql;
```

### วิธีที่ 3: ใช้ MySQL Workbench

1. เปิด MySQL Workbench
2. เชื่อมต่อกับ MySQL Server
3. File → Open SQL Script → เลือกไฟล์ `database.sql`
4. คลิก Execute (⚡)

---

## 🗄️ โครงสร้างฐานข้อมูล

### ตารางหลัก (Main Tables)

#### 1. **stores** - ข้อมูลร้าน
```sql
- id: รหัสร้าน (Primary Key)
- name: ชื่อร้าน
- address: ที่อยู่
- phone: เบอร์โทรศัพท์
```

#### 2. **new_devices** - เครื่องใหม่
```sql
- id: รหัสเครื่อง
- store_id: รหัสร้าน
- brand, model, color: ข้อมูลเครื่อง
- ram, rom, imei: สเปค
- purchase_price: ราคาซื้อ
- sale_price: ราคาขาย
- import_date: วันที่นำเข้า
- sale_date: วันที่ขาย
- status: สถานะ (stock/sold/removed)
```

#### 3. **used_devices** - เครื่องมือสอง
```sql
- เหมือน new_devices
- condition_status: สภาพเครื่อง
- purchase_date: วันที่รับซื้อ
```

#### 4. **installment_devices** - รายการผ่อน
```sql
- customer_name, customer_phone: ข้อมูลลูกค้า
- sale_price, down_payment: ยอดจัดและเงินดาวน์
- total_installments: จำนวนงวด
- installment_amount: ยอดผ่อนต่องวด
- paid_installments: งวดที่ชำระแล้ว
- status: active/completed/seized
```

#### 5. **installment_payments** - ประวัติการชำระ
```sql
- installment_id: รหัสรายการผ่อน
- installment_number: งวดที่
- payment_date: วันที่ชำระ
- amount: ยอดเงิน
```

#### 6. **pawn_devices** - ขายฝาก
```sql
- customer_name, customer_phone: ข้อมูลลูกค้า
- pawn_amount: ยอดขายฝาก
- interest: ดอกเบี้ย
- receive_date: วันที่รับ
- due_date: วันครบกำหนด
- return_date: วันที่คืน
- status: active/returned/seized
```

#### 7. **repair_devices** - เครื่องซ่อม
```sql
- customer_name, customer_phone: ข้อมูลลูกค้า
- symptom: อาการ
- repair_cost: ค่าซ่อม
- receive_date: วันที่รับ
- completed_date: วันที่ซ่อมเสร็จ
- return_date: วันที่คืน
- status: pending/in-repair/completed/returned/received
```

#### 8. **accessories** - อะไหล่
```sql
- code: รหัสอะไหล่
- type: ประเภท (จอ/แบต/ฯลฯ)
- brand, models: ยี่ห้อและรุ่นที่ใช้ได้
- quantity: จำนวน
- claim_quantity: จำนวนที่เคลม
- cost_price, sale_price: ราคาทุนและขาย
- status: in-stock/claim
```

#### 9. **equipment** - อุปกรณ์
```sql
- type: ประเภท (charger-set/cable/adapter/ฯลฯ)
- code: รหัสสินค้า
- brand, model: ยี่ห้อและรุ่น
- quantity: จำนวน
- cost_price, sale_price: ราคา
```

### Views (ตารางมุมมอง)

#### **v_monthly_income** - รายได้รายเดือน
```sql
แสดงรายได้แยกตามร้านและเดือน
```

#### **v_monthly_expenses** - รายจ่ายรายเดือน
```sql
แสดงรายจ่ายแยกตามร้านและเดือน
```

#### **v_stock_summary** - สรุปสต็อก
```sql
แสดงจำนวนสต็อกและมูลค่าแยกตามประเภท
```

### Stored Procedures

#### **sp_get_dashboard_stats(store_id, month)**
```sql
ดึงข้อมูลสถิติทั้งหมดสำหรับแดชบอร์ด
```

#### **sp_mark_device_sold(device_id, device_type, sale_price, sale_date)**
```sql
อัปเดตสถานะเครื่องเป็น "ขายแล้ว"
```

#### **sp_process_installment_payment(installment_id, payment_date)**
```sql
บันทึกการชำระงวดและอัปเดตสถานะ
```

---

## 🔌 การเชื่อมต่อฐานข้อมูล

### ตั้งค่าการเชื่อมต่อ

แก้ไขไฟล์ `db_config.php`:

```php
define('DB_HOST', 'localhost');     // ที่อยู่ MySQL Server
define('DB_USER', 'root');          // Username
define('DB_PASS', '');              // Password (ถ้ามี)
define('DB_NAME', 'mobile_shop_db'); // ชื่อฐานข้อมูล
```

### ทดสอบการเชื่อมต่อ

สร้างไฟล์ `test_connection.php`:

```php
<?php
require_once 'db_config.php';

$result = testConnection();
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
```

เรียกใช้: `http://localhost/การจัดการร้านมือถือ/test_connection.php`

---

## 🌐 การใช้งาน API

### ตัวอย่างการสร้าง API Endpoints

สร้างโฟลเดอร์ `api/` และเพิ่มไฟล์ต่างๆ:

#### `api/devices.php` - จัดการเครื่องใหม่

```php
<?php
require_once '../db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();

switch($method) {
    case 'GET':
        // ดึงข้อมูลเครื่องทั้งหมด
        $store_id = $_GET['store_id'] ?? null;
        $sql = "SELECT * FROM new_devices WHERE store_id = :store_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute(['store_id' => $store_id]);
        $devices = $stmt->fetchAll();
        echo json_encode($devices);
        break;
        
    case 'POST':
        // เพิ่มเครื่องใหม่
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO new_devices (id, store_id, brand, model, color, ram, rom, 
                imei, purchase_price, sale_price, import_date, status) 
                VALUES (:id, :store_id, :brand, :model, :color, :ram, :rom, 
                :imei, :purchase_price, :sale_price, :import_date, :status)";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute($data);
        echo json_encode(['success' => $result]);
        break;
        
    case 'PUT':
        // อัปเดตข้อมูล
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "UPDATE new_devices SET 
                brand = :brand, model = :model, color = :color,
                ram = :ram, rom = :rom, imei = :imei,
                purchase_price = :purchase_price, sale_price = :sale_price,
                status = :status
                WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute($data);
        echo json_encode(['success' => $result]);
        break;
        
    case 'DELETE':
        // ลบข้อมูล
        $id = $_GET['id'];
        $sql = "DELETE FROM new_devices WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute(['id' => $id]);
        echo json_encode(['success' => $result]);
        break;
}
?>
```

### การเรียกใช้ API จาก JavaScript

```javascript
// ดึงข้อมูล
async function getDevices(storeId) {
    const response = await fetch(`api/devices.php?store_id=${storeId}`);
    const data = await response.json();
    return data;
}

// เพิ่มข้อมูล
async function addDevice(deviceData) {
    const response = await fetch('api/devices.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
    });
    const result = await response.json();
    return result;
}

// อัปเดตข้อมูล
async function updateDevice(deviceData) {
    const response = await fetch('api/devices.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
    });
    const result = await response.json();
    return result;
}

// ลบข้อมูล
async function deleteDevice(deviceId) {
    const response = await fetch(`api/devices.php?id=${deviceId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    return result;
}
```

---

## 📊 ตัวอย่างการใช้งาน Stored Procedures

### ใช้ใน PHP

```php
<?php
require_once 'db_config.php';
$conn = getDBConnection();

// เรียกใช้ sp_get_dashboard_stats
$stmt = $conn->prepare("CALL sp_get_dashboard_stats(:store_id, :month)");
$stmt->execute([
    'store_id' => 'salaya',
    'month' => '2025-10'
]);

// รับผลลัพธ์หลายชุด
$newDevices = $stmt->fetchAll();
$stmt->nextRowset();
$usedDevices = $stmt->fetchAll();
$stmt->nextRowset();
$installments = $stmt->fetchAll();
// ... ฯลฯ

echo json_encode([
    'newDevices' => $newDevices,
    'usedDevices' => $usedDevices,
    'installments' => $installments
], JSON_UNESCAPED_UNICODE);
?>
```

### ใช้ใน MySQL Direct

```sql
-- ดูสถิติแดชบอร์ด
CALL sp_get_dashboard_stats('salaya', '2025-10');

-- ขายเครื่อง
CALL sp_mark_device_sold('ND001', 'new', 42000, '2025-10-15');

-- บันทึกการชำระงวด
CALL sp_process_installment_payment('INST001', '2025-10-15');
```

---

## 🔒 การสำรองข้อมูล (Backup)

### สำรองด้วย mysqldump

```bash
# Backup ฐานข้อมูลทั้งหมด
mysqldump -u root -p mobile_shop_db > backup_$(date +%Y%m%d).sql

# Backup เฉพาะโครงสร้าง (ไม่มีข้อมูล)
mysqldump -u root -p --no-data mobile_shop_db > schema_only.sql

# Backup เฉพาะข้อมูล (ไม่มีโครงสร้าง)
mysqldump -u root -p --no-create-info mobile_shop_db > data_only.sql
```

### Restore จาก Backup

```bash
mysql -u root -p mobile_shop_db < backup_20251007.sql
```

---

## 🐛 แก้ไขปัญหา (Troubleshooting)

### ปัญหา: ไม่สามารถเชื่อมต่อฐานข้อมูล

```
ตรวจสอบ:
1. MySQL Server ทำงานอยู่หรือไม่
2. Username และ Password ถูกต้องหรือไม่
3. ชื่อฐานข้อมูลถูกต้องหรือไม่
4. Host ถูกต้องหรือไม่ (localhost หรือ 127.0.0.1)
```

### ปัญหา: Error 1064 (Syntax Error)

```
- ตรวจสอบว่าใช้ MySQL version ที่รองรับหรือไม่
- ลอง import ทีละส่วน
- ตรวจสอบ character encoding
```

### ปัญหา: CORS Error ใน Browser

```php
// เพิ่มใน db_config.php หรือไฟล์ API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## 📚 เอกสารเพิ่มเติม

- [MySQL Official Documentation](https://dev.mysql.com/doc/)
- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [RESTful API Best Practices](https://restfulapi.net/)

---

## 📞 ติดต่อและสนับสนุน

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- Email: support@mobileshop.com
- Line: @mobileshop

---

**หมายเหตุ:** กรุณาเปลี่ยนรหัสผ่านฐานข้อมูลและตั้งค่าความปลอดภัยก่อนนำไปใช้งานจริง!

