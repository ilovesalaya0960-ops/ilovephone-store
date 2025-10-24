# แก้ไขปัญหารายการผ่อน

## ปัญหาที่พบ

### 1. ข้อมูลแสดงผิดช่องตอนแก้ไข
**สาเหตุ:** API ส่งข้อมูลเป็น snake_case (`customer_name`, `down_payment`, etc.) แต่โค้ดเรียกใช้เป็น camelCase (`customerName`, `downPayment`, etc.)

**ตัวอย่าง:**
```javascript
// ❌ ก่อนแก้ไข - ข้อมูลไม่แสดง
document.getElementById('customerName').value = installment.customerName; // undefined!

// ✅ หลังแก้ไข - รองรับทั้ง 2 แบบ
document.getElementById('customerName').value = installment.customer_name || installment.customerName;
```

### 2. วันครบกำหนดจ่ายค่างวด
**ปัญหาเดิม:** คำนวณวันวางดาวน์ + 30 วัน  
**ต้องการ:** คำนวณวันวางดาวน์ + 29 วัน

## การแก้ไข

### 1. แก้ไข openInstallmentModal() ✅

**เพิ่ม Support สำหรับทั้ง snake_case และ camelCase:**

```javascript
// รองรับทั้ง 2 รูปแบบ
document.getElementById('customerName').value = installment.customer_name || installment.customerName;
document.getElementById('customerPhone').value = installment.customer_phone || installment.customerPhone;
document.getElementById('costPrice').value = installment.cost_price || installment.costPrice;
document.getElementById('salePrice').value = installment.sale_price || installment.salePrice;
document.getElementById('downPayment').value = installment.down_payment || installment.downPayment;
document.getElementById('totalInstallments').value = installment.total_installments || installment.totalInstallments;
document.getElementById('installmentAmount').value = installment.installment_amount || installment.installmentAmount;
document.getElementById('downPaymentDate').value = installment.down_payment_date || installment.downPaymentDate;
```

### 2. เปลี่ยนจาก 30 วัน เป็น 29 วัน ✅

**ในฟังก์ชัน openInstallmentModal (Add mode):**
```javascript
// ก่อน: +30 วัน
nextDue.setDate(nextDue.getDate() + 30);

// หลัง: +29 วัน
nextDue.setDate(nextDue.getDate() + 29);
```

**ในฟังก์ชัน saveInstallment:**
```javascript
// ก่อน: +30 วัน
nextDueDate.setDate(nextDueDate.getDate() + 30);

// หลัง: +29 วัน
nextDueDate.setDate(nextDueDate.getDate() + 29);
```

### 3. เพิ่มฟังก์ชันคำนวณอัตโนมัติ ✅

**ฟังก์ชันใหม่: calculateNextDueDate()**
- คำนวณวันครบกำหนดจ่ายค่างวดอัตโนมัติ
- ทำงานเมื่อเปลี่ยนวันวางเงินดาวน์
- คำนวณเป็น: วันวางดาวน์ + 29 วัน

```javascript
function calculateNextDueDate() {
    const downPaymentDateInput = document.getElementById('downPaymentDate');
    const nextDueDateInput = document.getElementById('nextDueDate');
    
    if (downPaymentDateInput && downPaymentDateInput.value) {
        const downPaymentDate = new Date(downPaymentDateInput.value);
        downPaymentDate.setDate(downPaymentDate.getDate() + 29);
        const nextDueDate = downPaymentDate.toISOString().split('T')[0];
        
        if (nextDueDateInput) {
            nextDueDateInput.value = nextDueDate;
            console.log('📅 Next due date calculated:', {
                downPayment: downPaymentDateInput.value,
                nextDue: nextDueDate,
                daysAdded: 29
            });
        }
    }
}
```

**เพิ่ม Event Listener:**
```javascript
// ใน openInstallmentModal()
const downPaymentDateInput = document.getElementById('downPaymentDate');
if (downPaymentDateInput) {
    downPaymentDateInput.addEventListener('change', calculateNextDueDate);
}
```

## ผลลัพธ์

### ✅ ตอนเพิ่มรายการ:
1. กรอกวันวางเงินดาวน์: **12 ตุลาคม 2568**
2. วันครบกำหนดจ่ายค่างวดคำนวณอัตโนมัติ: **10 พฤศจิกายน 2568** (12 + 29 วัน)

### ✅ ตอนแก้ไขรายการ:
1. ข้อมูลทุกช่องแสดงถูกต้อง
2. ชื่อลูกค้า, เบอร์โทร, ราคา แสดงครบถ้วน
3. เปลี่ยนวันวางดาวน์ → วันครบกำหนดอัพเดทอัตโนมัติ

### ✅ Console Logs:

**ตอนแก้ไข:**
```
📝 Editing installment: {
  customer_name: "นางสาวจันทร์",
  down_payment: 2000,
  installment_amount: 1690,
  // ... etc
}
```

**ตอนเปลี่ยนวันวางดาวน์:**
```
📅 Next due date calculated: {
  downPayment: "2568-10-12",
  nextDue: "2568-11-10",
  daysAdded: 29
}
```

**ตอนบันทึก:**
```
💾 Saving installment: {
  downPaymentDate: "2568-10-12",
  nextDueDate: "2568-11-10",
  daysAdded: 29
}
```

## การทดสอบ

### 1. ทดสอบเพิ่มรายการ:
1. กด "+ เพิ่มรายการผ่อน"
2. กรอกข้อมูล
3. เลือกวันวางเงินดาวน์: เช่น 12 ต.ค. 2568
4. **ตรวจสอบ:** วันครบกำหนดต้องเป็น 10 พ.ย. 2568 (12 + 29 = 41 ต.ค. → 10 พ.ย.)

### 2. ทดสอบแก้ไขรายการ:
1. กดปุ่ม "แก้ไข" ที่รายการใดรายการหนึ่ง
2. **ตรวจสอบ:** ข้อมูลทุกช่องต้องแสดงถูกต้อง
   - ชื่อลูกค้า ✓
   - เบอร์โทร ✓
   - ราคาทุน ✓
   - ราคาขาย ✓
   - เงินดาวน์ ✓
   - จำนวนงวด ✓
   - ยอดผ่อน/งวด ✓

### 3. ทดสอบเปลี่ยนวันวางดาวน์:
1. เปิดฟอร์มเพิ่ม/แก้ไข
2. เปลี่ยนวันวางเงินดาวน์
3. **ตรวจสอบ:** วันครบกำหนดต้องอัพเดทอัตโนมัติ (+29 วัน)

## ไฟล์ที่แก้ไข

- ✅ `script.js` - แก้ไข openInstallmentModal(), saveInstallment(), เพิ่ม calculateNextDueDate()

## หมายเหตุ

- รองรับทั้ง snake_case (จาก API) และ camelCase (legacy)
- วันครบกำหนด = วันวางดาวน์ + 29 วัน (ไม่ใช่ 30 วัน)
- มี console.log สำหรับ debug

