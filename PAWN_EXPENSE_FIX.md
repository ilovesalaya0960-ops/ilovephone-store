# แก้ไขปัญหาการแสดงยอดขายฝากในการ์ดรายจ่าย

## ปัญหาที่พบ

เมื่อเพิ่มรายการขายฝาก (เช่น 1,200 บาท) การ์ด "ขายฝาก" ในหมวดรายจ่าย (Expenses) ยังแสดง ฿0 ไม่ได้แสดงยอดที่เพิ่มไป

## สาเหตุ

ฟังก์ชัน `updateDashboard()` ใช้ตัวแปร global `pawnDevices` ซึ่งเป็น array ว่างเปล่า เพราะ:
1. ฟังก์ชัน `initializePawnDatabase()` ถูก comment ออก (ไม่ใช้ localStorage อีกต่อไป)
2. ฟังก์ชัน `loadPawnData()` โหลดข้อมูลจาก API แต่เก็บไว้ใน local variable ไม่ได้อัปเดต global variable

## การแก้ไข

แก้ไขฟังก์ชัน `updateDashboard()` ให้โหลดข้อมูล pawn จาก API โดยตรงแทนที่จะใช้ตัวแปร global

### 1. แก้ไขส่วนคำนวณรายได้ (Income) จากการรับเครื่องคืน

**เดิม:**
```javascript
if (pawnDevices) {
    const returnedPawnAmount = pawnDevices
        .filter(p => p.store === currentStore && ...)
        ...
}
```

**ใหม่:**
```javascript
try {
    const pawnDevicesData = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
    const returnedPawnAmount = pawnDevicesData
        .filter(p => p.status === 'returned' && ...)
        ...
} catch (error) {
    console.error('Error loading pawn devices for income:', error);
}
```

### 2. แก้ไขส่วนคำนวณรายจ่าย (Expense) จากยอดขายฝาก

**เดิม:**
```javascript
if (pawnDevices) {
    expensePawn = pawnDevices
        .filter(p => p.store === currentStore && ...)
        ...
}
```

**ใหม่:**
```javascript
try {
    const pawnDevicesData = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
    expensePawn = pawnDevicesData
        .filter(p => (p.receive_date || p.receiveDate))
        .filter(p => {
            const receiveDate = new Date(p.receive_date || p.receiveDate);
            return receiveDate.getFullYear().toString() === currentYear &&
                   (receiveDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
        })
        .reduce((sum, p) => sum + ((p.pawn_amount || p.pawnAmount) || 0), 0);
    console.log('Pawn expense calculation:', {
        currentStore,
        currentMonth: `${currentYear}-${currentMonthNum}`,
        totalPawns: pawnDevicesData.length,
        filteredPawns: pawnDevicesData.filter(p => (p.receive_date || p.receiveDate)).length,
        expensePawn
    });
} catch (error) {
    console.error('Error loading pawn devices for expense:', error);
}
```

## วิธีทดสอบ

### 1. รีเฟรชหน้าเว็บ
กด F5 หรือรีเฟรชหน้าเว็บให้โหลดโค้ดใหม่

### 2. ตรวจสอบข้อมูลปัจจุบัน
- เปิดแดshบอร์ด
- เลือกร้านคลองโยง
- ดูการ์ด "ขายฝาก" ในหมวดรายจ่าย ควรแสดง ฿1,200

### 3. ทดสอบเพิ่มรายการใหม่
- ไปที่แท็บ "ขายฝาก"
- คลิก "เพิ่มรายการขายฝาก"
- กรอกข้อมูล:
  - ร้าน: คลองโยง
  - ยอดขายฝาก: 5000
  - กรอกข้อมูลอื่นๆ
- บันทึก
- กลับไปดูแดshบอร์ด
- การ์ด "ขายฝาก" ควรแสดง ฿6,200 (1,200 + 5,000)

### 4. ตรวจสอบ Console Log
เปิด Developer Tools (F12) > Console แล้วดูข้อมูล:
```
Pawn expense calculation: {
  currentStore: "klongyong",
  currentMonth: "2025-10",
  totalPawns: 2,
  filteredPawns: 2,
  expensePawn: 6200
}
```

## การคำนวณรายจ่ายขายฝาก

**รายจ่าย (Expense)** = ยอดเงินที่จ่ายให้ลูกค้าตอนรับเครื่องขายฝาก (pawn_amount)

**เงื่อนไข:**
1. ต้องเป็นร้านที่เลือก (currentStore)
2. วันที่รับเครื่อง (receive_date) ต้องอยู่ในเดือนปัจจุบัน

**ตัวอย่าง:**
- เพิ่มรายการขายฝาก วันที่ 24 ต.ค. 2025 ยอด 1,200 บาท
- ระบบจะบันทึกเป็นรายจ่ายเดือน ต.ค. 2025 จำนวน 1,200 บาท
- แดshบอร์ดจะแสดงในการ์ด "ขายฝาก" (Expenses)

## หมายเหตุ

- การ์ด "ขายฝาก" ในหมวดรายได้ (Income) จะแสดงยอดที่รับเมื่อลูกค้ามาไถ่ถอน
- การ์ด "ขายฝาก" ในหมวดรายจ่าย (Expense) จะแสดงยอดที่จ่ายให้ลูกค้าตอนรับเครื่อง
- กำไร (Profit) = รายได้ - รายจ่าย

