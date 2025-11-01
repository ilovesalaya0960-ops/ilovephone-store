# 🎨 คู่มือใช้งาน Custom Alert/Confirm Dialog

## ภาพรวม

ระบบ Custom Dialog ถูกสร้างขึ้นเพื่อแทนที่ `alert()` และ `confirm()` แบบ browser default ที่ดูไม่สวยงาม ด้วย UI ที่สวยงาม ทันสมัย และเข้ากับระบบ

## ✨ ฟีเจอร์

- ✅ **UI สวยงาม**: ออกแบบให้เข้ากับ iLovePhone Store System
- ✅ **Animation ลื่นไหล**: Fade in/Slide up effect
- ✅ **Responsive**: รองรับทั้ง Desktop และ Mobile
- ✅ **รองรับหลายประเภท**: Success, Error, Warning, Info, Question
- ✅ **แสดง List**: สามารถแสดงรายการแบบ bullet points ได้
- ✅ **Keyboard Support**: กด ESC เพื่อปิด
- ✅ **Click Outside**: คลิกนอก dialog เพื่อปิด
- ✅ **Promise-based**: ใช้งานง่ายด้วย async/await

## 📚 การใช้งาน

### 1. Custom Alert (แจ้งเตือน)

#### 1.1 Alert แบบธรรมดา

```javascript
await customAlert({
    title: 'สำเร็จ',
    message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
    icon: 'success'
});
```

#### 1.2 Alert พร้อม List

```javascript
await customAlert({
    title: 'บันทึกสำเร็จ',
    message: 'ข้อมูลได้ถูกบันทึกแล้ว',
    icon: 'success',
    confirmText: 'เข้าใจแล้ว',
    confirmType: 'success',
    list: [
        { icon: 'check', iconSymbol: '✓', text: 'บันทึกลง Database สำเร็จ' },
        { icon: 'check', iconSymbol: '✓', text: 'อัพเดท Dashboard แล้ว' },
        { icon: 'info', iconSymbol: 'ℹ️', text: 'สามารถดูรายละเอียดได้ที่หน้ารายงาน' }
    ]
});
```

#### 1.3 Error Alert

```javascript
await customAlert({
    title: 'เกิดข้อผิดพลาด',
    message: 'ไม่สามารถเชื่อมต่อ Database ได้',
    icon: 'error',
    confirmType: 'danger'
});
```

#### 1.4 Warning Alert

```javascript
await customAlert({
    title: 'คำเตือน',
    message: 'กรุณาตรวจสอบข้อมูลก่อนบันทึก',
    icon: 'warning',
    list: [
        { icon: 'warning', iconSymbol: '⚠️', text: 'ยี่ห้อห้ามเป็นค่าว่าง' },
        { icon: 'warning', iconSymbol: '⚠️', text: 'ราคาต้องมากกว่า 0' }
    ]
});
```

### 2. Custom Confirm (ยืนยัน)

#### 2.1 Confirm แบบธรรมดา

```javascript
const confirmed = await customConfirm({
    title: 'ยืนยันการลบ',
    message: 'ต้องการลบข้อมูลนี้ใช่หรือไม่?',
    icon: 'question',
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    confirmType: 'danger'
});

if (confirmed) {
    // ทำการลบ
    console.log('ผู้ใช้กดยืนยัน');
} else {
    // ยกเลิก
    console.log('ผู้ใช้กดยกเลิก');
}
```

#### 2.2 Confirm พร้อม List (ตัวอย่างจริงจากระบบ)

```javascript
const confirmed = await customConfirm({
    title: 'ตัดสลับเครื่องไปร้านอื่น',
    message: 'Samsung Galaxy S23 (Phantom Black)',
    icon: 'question',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    confirmType: 'success',
    list: [
        {
            icon: 'check',
            iconSymbol: '✓',
            text: 'ร้านศาลายา: บันทึกใน "ตัดออก"'
        },
        {
            icon: 'check',
            iconSymbol: '✓',
            text: 'ร้านคลองโยง: เพิ่มใน "สต๊อค"'
        },
        {
            icon: 'check',
            iconSymbol: '✓',
            text: 'ราคาทุนและราคาขายยังคงเดิม'
        },
        {
            icon: 'info',
            iconSymbol: '💡',
            text: 'สามารถเช็คได้ทั้ง 2 ร้าน'
        }
    ]
});

if (confirmed) {
    // ทำการตัดสลับ
}
```

#### 2.3 Confirm การขาย

```javascript
const confirmed = await customConfirm({
    title: 'ยืนยันการขาย',
    message: 'ต้องการขายเครื่องนี้ใช่หรือไม่?',
    icon: 'question',
    confirmText: 'ขาย',
    cancelText: 'ยกเลิก',
    confirmType: 'success',
    list: [
        { icon: 'check', iconSymbol: '📱', text: 'iPhone 14 Pro Max (Deep Purple)' },
        { icon: 'check', iconSymbol: '💰', text: 'ราคาขาย: ฿35,000' },
        { icon: 'check', iconSymbol: '📊', text: 'กำไร: ฿5,000 (16.67%)' }
    ]
});
```

## 🎨 Icon Types

ระบบรองรับ icon 5 ประเภท:

| Icon | ใช้งาน | สี Gradient |
|------|--------|-------------|
| `success` ✅ | การบันทึกสำเร็จ, การขายสำเร็จ | เขียว |
| `error` ❌ | Error, การลบ, การยกเลิก | แดง |
| `warning` ⚠️ | คำเตือน, การตรวจสอบ | ส้ม |
| `info` ℹ️ | ข้อมูล, แจ้งเตือนทั่วไป | ฟ้า |
| `question` ❓ | Confirm, ยืนยัน | น้ำเงิน |

## 🎯 Confirm Button Types

| Type | ใช้งาน | สี |
|------|--------|-----|
| `primary` | ทั่วไป (default) | ม่วง |
| `success` | บันทึก, ยืนยัน | เขียว |
| `danger` | ลบ, ตัดออก | แดง |

## 📋 Parameters

### customAlert(options)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | 'แจ้งเตือน' | หัวข้อ |
| `message` | string | '' | ข้อความ |
| `list` | array | [] | รายการ (optional) |
| `icon` | string | 'info' | ประเภท icon |
| `confirmText` | string | 'ตกลง' | ข้อความปุ่ม |
| `confirmType` | string | 'primary' | ประเภทปุ่ม |

**Returns:** `Promise<void>`

### customConfirm(options)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | 'ยืนยันการทำงาน' | หัวข้อ |
| `message` | string | '' | ข้อความ |
| `list` | array | [] | รายการ (optional) |
| `icon` | string | 'question' | ประเภท icon |
| `confirmText` | string | 'ตกลง' | ข้อความปุ่มยืนยัน |
| `cancelText` | string | 'ยกเลิก' | ข้อความปุ่มยกเลิก |
| `confirmType` | string | 'primary' | ประเภทปุ่ม |

**Returns:** `Promise<boolean>` - `true` ถ้ายืนยัน, `false` ถ้ายกเลิก

### List Item Format

```javascript
{
    icon: 'check',        // Icon class: 'check', 'info', 'warning'
    iconSymbol: '✓',      // Symbol: '✓', 'ℹ️', '⚠️', '💡', ฯลฯ
    text: 'ข้อความ'       // ข้อความที่ต้องการแสดง
}
```

## 🔄 แทนที่ browser default

### เดิม (Browser Default)

```javascript
// Alert
alert('บันทึกสำเร็จ');

// Confirm
if (confirm('ต้องการลบใช่หรือไม่?')) {
    // ลบ
}
```

### ใหม่ (Custom Dialog)

```javascript
// Alert
await customAlert({
    title: 'สำเร็จ',
    message: 'บันทึกสำเร็จ',
    icon: 'success'
});

// Confirm
const confirmed = await customConfirm({
    title: 'ยืนยันการลบ',
    message: 'ต้องการลบใช่หรือไม่?',
    icon: 'question',
    confirmType: 'danger'
});

if (confirmed) {
    // ลบ
}
```

## 📱 ตัวอย่างการใช้งานในระบบ

### 1. ลบข้อมูล

```javascript
async function deleteDevice(deviceId) {
    const confirmed = await customConfirm({
        title: 'ยืนยันการลบ',
        message: 'ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)',
        icon: 'warning',
        confirmText: 'ลบ',
        cancelText: 'ยกเลิก',
        confirmType: 'danger'
    });

    if (confirmed) {
        try {
            await API.delete(`${API_ENDPOINTS.newDevices}/${deviceId}`);
            await customAlert({
                title: 'สำเร็จ',
                message: 'ลบข้อมูลเรียบร้อยแล้ว',
                icon: 'success'
            });
            loadNewDevicesData();
        } catch (error) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: error.message,
                icon: 'error',
                confirmType: 'danger'
            });
        }
    }
}
```

### 2. บันทึกข้อมูล

```javascript
async function saveDevice(event) {
    event.preventDefault();
    
    try {
        await API.post(API_ENDPOINTS.newDevices, deviceData);
        
        await customAlert({
            title: 'บันทึกสำเร็จ',
            message: 'เพิ่มเครื่องใหม่เรียบร้อยแล้ว',
            icon: 'success',
            confirmType: 'success',
            list: [
                { icon: 'check', iconSymbol: '✓', text: 'บันทึกลง Database สำเร็จ' },
                { icon: 'check', iconSymbol: '✓', text: 'แสดงในตารางแล้ว' },
                { icon: 'info', iconSymbol: '💡', text: 'สามารถแก้ไขได้ทุกเมื่อ' }
            ]
        });
        
        closeModal();
        loadDevices();
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}
```

### 3. ย้ายกลับสต๊อค

```javascript
async function moveBackToStock(deviceId) {
    const confirmed = await customConfirm({
        title: 'ย้ายกลับสต๊อค',
        message: 'ต้องการย้ายรายการนี้กลับไปสต๊อคใช่หรือไม่?',
        icon: 'question',
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
        confirmType: 'primary'
    });

    if (!confirmed) return;

    try {
        await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
            status: 'stock',
            sale_price: null,
            sale_date: null
        });
        
        await customAlert({
            title: 'สำเร็จ',
            message: 'ย้ายกลับสต๊อคเรียบร้อยแล้ว',
            icon: 'success'
        });
        
        loadNewDevicesData();
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error'
        });
    }
}
```

## 🎨 Customization

### เปลี่ยนสี Theme

แก้ไขใน `style.css`:

```css
/* Primary Color (ม่วง) */
.custom-dialog-btn.btn-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Success Color (เขียว) */
.custom-dialog-icon.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

### เปลี่ยน Animation

```css
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(60px) scale(0.9); /* เพิ่มระยะ */
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

## 🐛 Troubleshooting

### Dialog ไม่แสดง

1. เช็คว่า HTML element `<div id="customDialog">` มีอยู่ใน `index.html`
2. เช็คว่า CSS ถูก import แล้ว
3. เช็คว่าไม่มี JavaScript error ใน console

### ปุ่มไม่ทำงาน

1. ตรวจสอบว่า `customAlert()` หรือ `customConfirm()` ถูกเรียกด้วย `await`
2. ตรวจสอบว่าอยู่ใน `async function`

### Dialog ซ้อนกัน

1. ตรวจสอบว่าปิด dialog ก่อนหน้าแล้วก่อนเปิดใหม่
2. ใช้ `closeCustomDialog()` เพื่อปิด dialog แบบ manual

## 📝 Best Practices

1. **ใช้ icon ที่เหมาะสม**: Success = เขียว, Error = แดง, Question = น้ำเงิน
2. **ข้อความสั้นกระชับ**: หลีกเลี่ยงข้อความยาวเกินไป
3. **ใช้ list สำหรับรายละเอียด**: แทนที่จะเขียนข้อความยาวๆ
4. **Confirm type ให้ตรงกับการกระทำ**: ลบ = danger, บันทึก = success
5. **ใช้ async/await**: เพื่อรอผลลัพธ์จากผู้ใช้

## 🎉 สรุป

Custom Dialog ช่วยให้ระบบมี UI ที่สวยงาม สอดคล้องกัน และใช้งานง่ายกว่า browser default มาก!

**ตัวอย่างการใช้งานทั้งหมดอยู่ใน `script.js` ฟังก์ชัน `confirmTransferToOtherStore()`**

---

**Created by:** iLovePhone Store System  
**Version:** 1.0  
**Date:** 31 ตุลาคม 2025

