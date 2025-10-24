# แก้ไขปัญหายอดไถ่ถอนไม่แสดงในรายรับ

## ปัญหา

เมื่อคลิกการ์ด "ขายฝาก" ในหมวดรายรับ (Income Breakdown) 
รายการรับเครื่องคืนไม่แสดง เพราะ `currentMonth` เป็น `undefined`

### Console Log แสดงปัญหา:
```
Current Month: -undefined  ❌
Year Match: false
Month Match: false
Filtered returned items in current month: 0
```

## สาเหตุ

หน้า Income Breakdown และ Expense Breakdown ไม่มี `<select id="monthSelect">` 
แต่ฟังก์ชันพยายามดึงค่าจาก `document.getElementById('monthSelect')` 
ทำให้ได้ค่า `null` และ `.value` เป็น `undefined`

## วิธีแก้ไข

ใช้ตัวแปร global `currentStore` และ `currentMonth` ที่มีอยู่แล้วในระบบ

### ตัวแปร Global (อยู่แล้ว):
```javascript
let currentStore = 'salaya';
let currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
```

### ฟังก์ชันที่แก้ไข:

1. **getPawnInterestItems()**
2. **getPawnReturnItems()**
3. **getPawnExpenseActiveItems()**
4. **getPawnExpenseReturnedItems()**

### ตัวอย่างการแก้ไข:

**ก่อน:**
```javascript
async function getPawnReturnItems() {
    const currentStore = document.getElementById('storeSelect').value;  // ❌ อาจเป็น null
    const currentMonth = document.getElementById('monthSelect').value;  // ❌ อาจเป็น undefined
    const [currentYear, currentMonthNum] = currentMonth.split('-');
    // ...
}
```

**หลัง:**
```javascript
async function getPawnReturnItems() {
    // Use global currentStore and currentMonth variables ✓
    const [currentYear, currentMonthNum] = currentMonth.split('-');
    // ...
}
```

## วิธีทำงาน

1. เมื่อเข้าหน้าแดชบอร์ด ตัวแปร `currentStore` และ `currentMonth` จะถูกตั้งค่า
2. เมื่อเปลี่ยนค่าใน dropdown จะอัพเดทตัวแปรทันที:
   ```javascript
   monthSelect.addEventListener('change', function() {
       currentMonth = this.value;  // อัพเดทตัวแปร global
       updateDashboard();
   });
   ```
3. เมื่อคลิกการ์ดต่างๆ ฟังก์ชันจะใช้ค่าจากตัวแปร global

## ผลลัพธ์

### Console Log หลังแก้ไข:
```
==================== GET PAWN RETURN ITEMS ====================
Current Store: klongyong ✓
Current Month (raw): 2025-10 ✓
Current Year: 2025 ✓
Current Month Num: 10 ✓
Total pawn devices from API: 4
Returned items (all): 1
All returned items details:
  - ID: PWN1761295795382, Customer: สังคม, Return Date: 2025-10-24, Redemption: 1200.00
  Checking: PWN1761295795382, Return Date: 2025-10-24, Year Match: true, Month Match: true
Filtered returned items in current month: 1 ✓
Returned items details:
  - สังคม: Infinix hot60pro, Redemption: 1200 ✓
============================================================
```

## การทดสอบ

1. **รีเฟรชหน้าเว็บ** (Ctrl+F5)
2. **เปิด Console** (F12)
3. **คลิกการ์ด "ขายฝาก" ในหมวดรายรับ**
4. **ตรวจสอบ Console Log** - ควรเห็น:
   - Current Month: 2025-10 (ไม่ใช่ `-undefined`)
   - Year Match: true
   - Month Match: true
   - Filtered returned items in current month: > 0

5. **ตรวจสอบการแสดงผล**:
   - ✅ รายละเอียดดอกเบี้ยขายฝาก
   - ✅ รายละเอียดการรับเครื่องคืน (แสดงรายการ + ยอดรวม)

## ไฟล์ที่อัพเดท

- ✅ `script.js` - แก้ไข 4 ฟังก์ชันให้ใช้ตัวแปร global

## หมายเหตุ

ตัวแปร `currentStore` และ `currentMonth` เป็นตัวแปร global ที่ใช้ร่วมกันทั้งระบบ:
- อยู่ที่หน้าใดก็ได้ (Dashboard, Income Breakdown, Expense Breakdown)
- เมื่อเปลี่ยนค่าจะมีผลกับทุกหน้า
- ไม่ต้องส่งค่าผ่าน parameter

