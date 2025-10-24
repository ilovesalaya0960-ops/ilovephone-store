# วิธีตรวจสอบปัญหายอดไถ่ถอนไม่แสดง

## ขั้นตอนการตรวจสอบ:

### 1. เปิดหน้าเว็บและ Console
1. เปิดหน้าแดชบอร์ด
2. กด F12 เพื่อเปิด Developer Tools
3. ไปที่แท็บ Console

### 2. คลิกการ์ด "ขายฝาก" ในหมวดรายรับ
- จะเห็น 2 ส่วน:
  1. **รายละเอียดดอกเบี้ยขายฝาก**
  2. **รายละเอียดการรับเครื่องคืน** (ควรแสดงรายการที่ลูกค้ารับคืน)

### 3. ดู Console Log ที่แสดง:

```
==================== GET PAWN RETURN ITEMS ====================
Current Store: khlong-yong
Current Month: 2568-10
Total pawn devices from API: X
Returned items (all): X
All returned items details:
  - ID: xxx, Customer: xxx, Return Date: xxx, Redemption: xxx
  Checking: xxx, Return Date: xxx, Year Match: true/false, Month Match: true/false
Filtered returned items in current month: X
Returned items details:
  - Customer: xxx, Redemption: xxx
============================================================
```

### 4. สิ่งที่ต้องตรวจสอบ:

#### A. ตรวจสอบข้อมูลในฐานข้อมูล
```sql
SELECT 
    id,
    customer_name,
    brand,
    model,
    status,
    receive_date,
    return_date,
    pawn_amount,
    redemption_amount
FROM pawn_devices 
WHERE status = 'returned'
ORDER BY return_date DESC;
```

**สิ่งที่ต้องเช็ค:**
- `status` = 'returned' ✓
- `return_date` มีค่า ✓
- `redemption_amount` มีค่า ✓ (ไม่ใช่ 0 หรือ NULL)

#### B. ตรวจสอบวันที่
- `return_date` ต้องอยู่ในเดือนที่เลือก
- ตัวอย่าง: ถ้าเลือกเดือน "2568-10" (ตุลาคม 2568)
  - `return_date` ต้องเป็น 2025-10-xx (ปี ค.ศ. 2025)

#### C. ตรวจสอบ redemption_amount
- ถ้าเลือก "หักดอก" → redemption_amount = pawn_amount
- ถ้าเลือก "ยังไม่หักดอก" → redemption_amount = pawn_amount + interest

### 5. ปัญหาที่อาจพบ:

#### ปัญหา 1: `return_date` เป็น NULL
**แก้ไข:** เมื่อกดปุ่ม "รับเครื่องคืน" ต้องบันทึก `return_date` ลงฐานข้อมูล

#### ปัญหา 2: `redemption_amount` = 0 หรือ NULL
**แก้ไข:** เมื่อสร้างรายการขายฝาก ต้องคำนวณและบันทึก `redemption_amount`

#### ปัญหา 3: `return_date` ไม่ตรงกับเดือนที่เลือก
**แก้ไข:** เลือกเดือนที่ถูกต้อง หรือตรวจสอบว่า `return_date` บันทึกถูกต้อง

### 6. ตัวอย่างข้อมูลที่ถูกต้อง:

```json
{
  "id": "P001",
  "customer_name": "สิงคม",
  "brand": "Infinix",
  "model": "hot60pro",
  "status": "returned",
  "receive_date": "2025-10-22",
  "return_date": "2025-10-24",
  "pawn_amount": 1200,
  "interest": 120,
  "interest_collection_method": "deducted",
  "redemption_amount": 1200
}
```

### 7. การคำนวณรายรับ:

```
รายรับขายฝาก = ดอกเบี้ย + ยอดไถ่ถอน
```

**จากตัวอย่าง:**
- ดอกเบี้ย (หักดอกวันรับเครื่อง): ฿120
- ยอดไถ่ถอน (วันรับคืน): ฿1,200
- **รวม: ฿1,320**

### 8. ถ้ายังไม่แสดง:

ให้ส่ง Console Log ทั้งหมดมาให้ตรวจสอบ โดยเฉพาะส่วน:
1. "==================== PAWN INCOME CALCULATION ===================="
2. "==================== GET PAWN RETURN ITEMS ===================="
