# แก้ไขปัญหาการคำนวณรายได้ขายฝาก

## ปัญหาที่พบ

การแสดงรายได้ขายฝากแสดงผล **฿12,001,200** แทนที่จะเป็น **฿1,320** (120 + 1,200)

## สาเหตุ

เกิดจากการต่อ string แทนที่จะบวกตัวเลข:
- "120" + "01200" = "12001200" 
- เมื่อ format จะได้ "12,001,200"

ปัญหาเกิดจาก:
1. ข้อมูลจาก API อาจเป็น string ไม่ได้ convert เป็น number
2. ไม่มีการ parseFloat ครบทุกตำแหน่ง
3. ใช้ `pawn_amount` แทน `redemption_amount` (ยอดไถ่ถอนที่ถูกต้อง)

## การแก้ไข

### 1. เปลี่ยนจากใช้ `pawn_amount` เป็น `redemption_amount`

**เดิม:**
```javascript
.reduce((sum, p) => sum + ((p.pawn_amount || p.pawnAmount) || 0), 0);
```

**ใหม่:**
```javascript
.reduce((sum, p) => {
    const redemptionAmount = parseFloat(p.redemption_amount || p.redemptionAmount) || 0;
    return sum + redemptionAmount;
}, 0);
```

### 2. เพิ่มการ parseFloat และ console.log สำหรับ debug

```javascript
// Income from pawn (interest + returned amount)
let incomePawn = 0;

// 1. Income from pawn interest (from transactions)
let pawnInterestAmount = 0;
try {
    const [year, month] = currentMonth.split('-');
    const pawnInterest = await API.get('http://localhost:5001/api/pawn-interest/summary', {
        store: currentStore,
        year: year,
        month: month
    });
    pawnInterestAmount = parseFloat(pawnInterest.total_interest) || 0;
    console.log('Pawn interest from transactions:', pawnInterestAmount);
} catch (error) {
    console.error('Error loading pawn interest:', error);
}

// 2. Income from returned pawn devices (customer paid back - redemption amount)
let returnedPawnAmount = 0;
try {
    const pawnDevicesData = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
    returnedPawnAmount = pawnDevicesData
        .filter(p => p.status === 'returned' && (p.return_date || p.returnDate))
        .filter(p => {
            const returnDate = new Date(p.return_date || p.returnDate);
            return returnDate.getFullYear().toString() === currentYear &&
                   (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
        })
        .reduce((sum, p) => {
            const redemptionAmount = parseFloat(p.redemption_amount || p.redemptionAmount) || 0;
            return sum + redemptionAmount;
        }, 0);
    console.log('Returned pawn redemption amount:', returnedPawnAmount);
} catch (error) {
    console.error('Error loading pawn devices for income:', error);
}

// Total pawn income = interest + redemption amount when customer returns
incomePawn = parseFloat(pawnInterestAmount) + parseFloat(returnedPawnAmount);
console.log('Total pawn income:', {
    interest: pawnInterestAmount,
    returned: returnedPawnAmount,
    total: incomePawn
});
```

## การคำนวณรายได้ขายฝาก (ที่ถูกต้อง)

**รายได้รวม** = ดอกเบี้ย + ยอดไถ่ถอน

### กรณีที่ 1: เลือก "หักดอก"
- **ดอกเบี้ย**: 120 บาท (บันทึกใน transaction เมื่อรับเครื่อง)
- **ยอดไถ่ถอน**: 1,200 บาท (เท่ากับยอดขายฝาก)
- **รายได้รวม**: 120 + 1,200 = **1,320 บาท**

### กรณีที่ 2: เลือก "ยังไม่หักดอก"
- **ดอกเบี้ย**: 0 บาท (ยังไม่ได้บันทึก transaction)
- **ยอดไถ่ถอน**: 1,320 บาท (= ยอดขายฝาก + ดอกเบี้ย)
- **รายได้รวม**: 0 + 1,320 = **1,320 บาท**

## วิธีทดสอบ

### 1. รีเฟรชหน้าเว็บ
กด F5 เพื่อโหลดโค้ดใหม่

### 2. ตรวจสอบการ์ดรายได้ขายฝาก
- เลือกร้านคลองโยง
- ดูการ์ด "ขายฝาก" ในหมวดรายได้
- ควรแสดง **฿1,320** (ถ้ามีดอกเบี้ย 120 + ยอดไถ่ถอน 1,200)

### 3. ตรวจสอบ Console Log
เปิด Developer Tools (F12) > Console:
```
Pawn interest from transactions: 120
Returned pawn redemption amount: 1200
Total pawn income: {
  interest: 120,
  returned: 1200,
  total: 1320
}
```

### 4. ทดสอบเพิ่มรายการใหม่

**กรณีทดสอบที่ 1: เลือก "หักดอก"**
1. เพิ่มขายฝาก 10,000 บาท เลือก "หักดอก"
2. ดอกเบี้ยคำนวณ = 1,000 บาท (10%)
3. ยอดไถ่ถอนแสดง = 10,000 บาท
4. กดรับเครื่องคืน
5. รายได้ที่เพิ่ม = 1,000 (ดอกเบี้ย) + 10,000 (ยอดไถ่ถอน) = 11,000 บาท

**กรณีทดสอบที่ 2: เลือก "ยังไม่หักดอก"**
1. เพิ่มขายฝาก 10,000 บาท เลือก "ยังไม่หักดอก"
2. ดอกเบี้ยคำนวณ = 1,000 บาท (10%)
3. ยอดไถ่ถอนแสดง = 11,000 บาท (10,000 + 1,000)
4. กดรับเครื่องคืน
5. รายได้ที่เพิ่ม = 0 (ไม่มีดอกเบี้ย transaction) + 11,000 (ยอดไถ่ถอน) = 11,000 บาท

## สรุป

**จุดสำคัญ:**
1. ใช้ `redemption_amount` (ยอดไถ่ถอน) แทน `pawn_amount` (ยอดขายฝาก)
2. ต้อง `parseFloat()` ทุกครั้งก่อนบวก
3. รายได้ขายฝาก = ดอกเบี้ย (จาก transaction) + ยอดไถ่ถอน (เมื่อรับเครื่องคืน)
4. ยอดไถ่ถอนจะรวมดอกเบี้ยอยู่แล้วถ้าเลือก "ยังไม่หักดอก"

## ความแตกต่างระหว่างรายรับกับรายจ่าย

| รายการ | รายรับ (Income) | รายจ่าย (Expense) |
|--------|-----------------|-------------------|
| **ขายฝาก** | ยอดไถ่ถอน + ดอกเบี้ย | ยอดขายฝาก (ที่จ่ายให้ลูกค้า) |
| **ตัวอย่าง** | 1,200 + 120 = 1,320 | 1,200 |
| **กำไร** | 1,320 - 1,200 = **120 บาท** (ดอกเบี้ย) | |

