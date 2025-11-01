# ♻️ อัพเดท: ระบบการจัดการเครื่องมือสอง (Actions)

## 📋 สรุปการแก้ไข

ปรับปรุงระบบการจัดการเครื่องมือสองให้มีฟังก์ชันการทำงาน (Actions) เหมือนเครื่องใหม่ 100%

## 🎯 ปัญหาที่แก้ไข

### ❌ ปัญหาเดิม
1. **ปุ่ม "ขาย"**: ไม่มี Modal ยืนยันราคาขาย (ใช้ `confirm()` แบบธรรมดา)
2. **ปุ่ม "ตัด"**: ไม่มี Modal เลือกประเภทการตัด (ใช้ `confirm()` และ `prompt()`)
3. **ไม่มี Modal แก้ไขราคา**: เมื่อตัดขายให้เจ้าอื่น
4. **UX ไม่สอดคล้อง**: ผู้ใช้จะสับสนเพราะเครื่องใหม่กับเครื่องมือสองทำงานต่างกัน

### ✅ หลังแก้ไข
1. **ปุ่ม "ขาย"**: มี Modal ยืนยันราคาขาย พร้อมคำนวณกำไร Real-time
2. **ปุ่ม "ตัด"**: มี Modal เลือกประเภท (ตัดให้เจ้าอื่น / ย้ายร้านตัวเอง)
3. **Modal แก้ไขราคา**: เมื่อตัดขายให้เจ้าอื่น สามารถแก้ไขราคาและดูผลต่าง
4. **UX สอดคล้อง**: เครื่องใหม่และเครื่องมือสองใช้งานเหมือนกัน 100%

## 📝 รายการฟังก์ชันที่แก้ไข

### 1. `markUsedAsSold()` - ปุ่ม "ขาย"

**เดิม:**
```javascript
// ไม่มี Modal ยืนยัน
async function markUsedAsSold(deviceId) {
    // บันทึกทันที ไม่มีการยืนยัน
}
```

**ใหม่:**
```javascript
// มี Modal ยืนยันราคาขาย (เหมือนเครื่องใหม่)
async function markUsedAsSold(deviceId) {
    // 1. ดึงข้อมูลเครื่อง
    // 2. เก็บ window.currentSaleDeviceType = 'used'
    // 3. แสดง Modal ยืนยันราคา
    // 4. คำนวณกำไร Real-time
    // 5. เปิด confirmSalePriceModal
}
```

**ฟีเจอร์:**
- ✅ แสดงข้อมูลเครื่อง (ยี่ห้อ, รุ่น, สี)
- ✅ แสดงราคาทุน (ราคารับซื้อ)
- ✅ แสดงราคาขายตั้งไว้
- ✅ แก้ไขราคาขายจริงได้
- ✅ คำนวณกำไร/ขาดทุน Real-time
- ✅ แสดงเปอร์เซ็นต์กำไร

### 2. `markUsedAsRemoved()` - ปุ่ม "ตัด"

**เดิม:**
```javascript
// ใช้ confirm() และ prompt() แบบธรรมดา
async function markUsedAsRemoved(deviceId) {
    const choice = confirm('กดตกลง = ตัดให้เจ้าอื่น, ยกเลิก = ย้ายร้าน');
    if (choice) {
        const note = prompt('ระบุเหตุผล:');
        // บันทึก
    } else {
        // ย้ายร้าน
    }
}
```

**ใหม่:**
```javascript
// มี Modal เลือกประเภท (เหมือนเครื่องใหม่)
async function markUsedAsRemoved(deviceId) {
    // 1. ดึงข้อมูลเครื่อง
    // 2. เก็บ window.currentRemoveDeviceType = 'used'
    // 3. แสดงข้อมูลใน Modal
    // 4. แสดง 2 ตัวเลือก:
    //    - ตัดขายให้เจ้าอื่น
    //    - ตัดสลับไปร้านตัวเอง
    // 5. เปิด confirmRemoveModal
}
```

**ฟีเจอร์:**
- ✅ Modal สวยงาม มี 2 ตัวเลือกชัดเจน
- ✅ แสดงข้อมูลเครื่อง
- ✅ แสดงราคาทุนและราคาขาย
- ✅ แสดงชื่อร้านปลายทาง (เมื่อย้ายร้าน)

### 3. `confirmTransferToOtherStore()` - ย้ายไปร้านตัวเอง

**เดิม:**
```javascript
// รองรับเฉพาะเครื่องใหม่
async function confirmTransferToOtherStore(device, deviceId) {
    await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {...});
    loadNewDevicesData();
}
```

**ใหม่:**
```javascript
// รองรับทั้งเครื่องใหม่และมือสอง
async function confirmTransferToOtherStore(device, deviceId) {
    const deviceType = window.currentRemoveDeviceType || 'new';
    const endpoint = deviceType === 'used' ? 
        API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
    
    await API.put(`${endpoint}/${deviceId}`, {...});
    
    // โหลดข้อมูลตามประเภท
    if (deviceType === 'used') {
        loadUsedDevicesData();
    } else {
        loadNewDevicesData();
    }
}
```

### 4. `confirmRemoveToOther()` - ตัดขายให้เจ้าอื่น

**เดิม:**
```javascript
// รองรับเฉพาะเครื่องใหม่
async function confirmRemoveToOther(event) {
    await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {...});
    loadNewDevicesData();
}
```

**ใหม่:**
```javascript
// รองรับทั้งเครื่องใหม่และมือสอง
async function confirmRemoveToOther(event) {
    const deviceType = window.currentRemoveDeviceType || 'new';
    const endpoint = deviceType === 'used' ? 
        API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
    
    await API.put(`${endpoint}/${deviceId}`, {...});
    
    // โหลดข้อมูลตามประเภท
    if (deviceType === 'used') {
        loadUsedDevicesData();
    } else {
        loadNewDevicesData();
    }
}
```

### 5. `confirmSalePrice()` - ยืนยันราคาขาย

**เดิม:**
```javascript
// รองรับเฉพาะเครื่องใหม่
async function confirmSalePrice(event) {
    await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {...});
    loadNewDevicesData();
}
```

**ปัจจุบัน (มีอยู่แล้ว):**
```javascript
// รองรับทั้งเครื่องใหม่และมือสอง
async function confirmSalePrice(event) {
    const deviceType = window.currentSaleDeviceType || 'new';
    const endpoint = deviceType === 'used' ? 
        API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
    
    await API.put(`${endpoint}/${deviceId}`, {...});
    
    // โหลดข้อมูลตามประเภท
    if (deviceType === 'used') {
        loadUsedDevicesData();
    } else {
        loadNewDevicesData();
    }
}
```

**หมายเหตุ:** ฟังก์ชันนี้รองรับเครื่องมือสองอยู่แล้ว ไม่ต้องแก้ไข

### 6. `moveUsedBackToStock()` - ย้ายกลับสต๊อค

**เดิม:**
```javascript
async function moveUsedBackToStock(deviceId) {
    await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
        status: 'stock',
        sale_date: null,
        note: ''
    });
}
```

**ใหม่:**
```javascript
async function moveUsedBackToStock(deviceId) {
    await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
        status: 'stock',
        sale_price: null,  // เพิ่ม: รีเซ็ตราคาขาย
        sale_date: null,
        note: ''
    });
}
```

## 🎨 UI/UX ที่ปรับปรุง

### Modal: ยืนยันราคาขาย (`confirmSalePriceModal`)

```
┌─────────────────────────────────────┐
│  ยืนยันราคาขาย                      │
├─────────────────────────────────────┤
│  📱 เครื่อง: Samsung Galaxy S23     │
│  💰 ราคาทุน: ฿15,000                │
│  💵 ราคาขายตั้งไว้: ฿19,000         │
│                                     │
│  ราคาขายจริง (฿): [19000]          │
│                                     │
│  ➕ กำไร: ฿4,000                    │
│  📊 กำไร: 26.67%                    │
│                                     │
│  [ยกเลิก]  [✅ ยืนยันการขาย]       │
└─────────────────────────────────────┘
```

### Modal: เลือกประเภทการตัด (`confirmRemoveModal`)

```
┌─────────────────────────────────────┐
│  🔄 เลือกประเภทการตัดขาย            │
├─────────────────────────────────────┤
│  📱 เครื่อง: Samsung Galaxy S23     │
│  💰 ราคาทุน: ฿15,000                │
│  💵 ราคาขายตั้งไว้: ฿19,000         │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🏪 ตัดขายให้เจ้าอื่น          │  │
│  │ รายการจะอยู่ในเมนู "ตัดออก"   │  │
│  │ 📝 ต้องแก้ไขราคาขายจริง       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🔄 ตัดสลับไปร้านตัวเอง        │  │
│  │ ย้ายไป: ร้านคลองโยง            │  │
│  │ 📦 ย้ายข้อมูลและสต๊อคไป       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Modal: ตัดขายให้เจ้าอื่น (`confirmRemoveOtherModal`)

```
┌─────────────────────────────────────┐
│  📝 แก้ไขราคาและหมายเหตุ            │
├─────────────────────────────────────┤
│  📱 เครื่อง: Samsung Galaxy S23     │
│  💰 ราคาทุน: ฿15,000                │
│  💵 ราคาขายตั้งไว้: ฿19,000         │
│                                     │
│  ราคาขายจริง (฿): [18000]          │
│                                     │
│  ➕ กำไร/ขาดทุน: ฿3,000             │
│  📊 กำไร: 20.00%                    │
│                                     │
│  หมายเหตุ:                          │
│  [ขายให้ร้านXXX ลดราคาเพื่อขาย]    │
│                                     │
│  [ยกเลิก]  [✅ บันทึก]              │
└─────────────────────────────────────┘
```

## 🔄 Flow การทำงาน

### Flow 1: ขายเครื่อง (ปุ่ม "ขาย")

```
1. คลิกปุ่ม "ขาย"
   ↓
2. markUsedAsSold(deviceId)
   ↓
3. ดึงข้อมูลเครื่องจาก API
   ↓
4. เก็บ window.currentSaleDeviceType = 'used'
   ↓
5. แสดง Modal ยืนยันราคา
   ↓
6. ผู้ใช้แก้ไขราคา (optional)
   ↓
7. ระบบคำนวณกำไร Real-time
   ↓
8. คลิก "ยืนยันการขาย"
   ↓
9. confirmSalePrice(event)
   ↓
10. บันทึกลง Database (used_devices)
    ↓
11. โหลดข้อมูลใหม่ (loadUsedDevicesData)
    ↓
12. แสดง Notification "บันทึกการขายสำเร็จ"
```

### Flow 2: ตัดขายให้เจ้าอื่น (ปุ่ม "ตัด" → "ตัดขายให้เจ้าอื่น")

```
1. คลิกปุ่ม "ตัด"
   ↓
2. markUsedAsRemoved(deviceId)
   ↓
3. ดึงข้อมูลเครื่องจาก API
   ↓
4. เก็บ window.currentRemoveDeviceType = 'used'
   ↓
5. แสดง Modal เลือกประเภท
   ↓
6. คลิก "ตัดขายให้เจ้าอื่น"
   ↓
7. selectRemoveOption('other')
   ↓
8. openConfirmRemoveOtherModal()
   ↓
9. แสดง Modal แก้ไขราคา
   ↓
10. ผู้ใช้แก้ไขราคา + กรอกหมายเหตุ
    ↓
11. ระบบคำนวณผลต่าง Real-time
    ↓
12. คลิก "บันทึก"
    ↓
13. confirmRemoveToOther(event)
    ↓
14. บันทึกลง Database (status='removed')
    ↓
15. โหลดข้อมูลใหม่
    ↓
16. แสดง Notification "ตัดขายให้เจ้าอื่นสำเร็จ"
```

### Flow 3: ตัดสลับไปร้านตัวเอง (ปุ่ม "ตัด" → "ตัดสลับไปร้านตัวเอง")

```
1. คลิกปุ่ม "ตัด"
   ↓
2. markUsedAsRemoved(deviceId)
   ↓
3. แสดง Modal เลือกประเภท
   ↓
4. คลิก "ตัดสลับไปร้านตัวเอง"
   ↓
5. selectRemoveOption('transfer')
   ↓
6. confirmTransferToOtherStore()
   ↓
7. แสดง Confirm Dialog
   ↓
8. คลิก "ตกลง"
   ↓
9. บันทึกลง Database (เปลี่ยน store)
   ↓
10. โหลดข้อมูลใหม่
    ↓
11. แสดง Notification "ย้ายเครื่องไปสต๊อคของ XXX สำเร็จ"
```

## 📊 เปรียบเทียบ: ก่อนและหลัง

| ฟีเจอร์ | ก่อน | หลัง |
|---------|------|------|
| **ปุ่ม "ขาย"** |  |  |
| Modal ยืนยัน | ❌ ไม่มี | ✅ มี |
| แสดงข้อมูลเครื่อง | ❌ | ✅ |
| แก้ไขราคาขาย | ❌ | ✅ |
| คำนวณกำไร Real-time | ❌ | ✅ |
| **ปุ่ม "ตัด"** |  |  |
| Modal เลือกประเภท | ❌ ใช้ confirm() | ✅ Modal สวย |
| แสดงข้อมูลเครื่อง | ❌ | ✅ |
| เลือกประเภทชัดเจน | ❌ | ✅ |
| **ตัดขายให้เจ้าอื่น** |  |  |
| Modal แก้ไขราคา | ❌ ใช้ prompt() | ✅ Modal ครบ |
| แก้ไขราคาได้ | ❌ | ✅ |
| คำนวณผลต่าง | ❌ | ✅ |
| กรอกหมายเหตุ | ❌ แค่ prompt | ✅ Textarea |
| **UX โดยรวม** |  |  |
| สอดคล้องกับเครื่องใหม่ | ❌ | ✅ 100% |
| ใช้งานง่าย | ⚠️ สับสน | ✅ ชัดเจน |

## ✅ Checklist ทดสอบ

### ทดสอบ "ขาย"
- [ ] คลิกปุ่ม "ขาย" → Modal เปิด
- [ ] แสดงข้อมูลเครื่องถูกต้อง
- [ ] แสดงราคาทุนและราคาขายถูกต้อง
- [ ] แก้ไขราคาขาย → กำไรคำนวณ Real-time
- [ ] คลิก "ยืนยัน" → บันทึกสำเร็จ
- [ ] ข้อมูลย้ายไป Tab "ขายแล้ว"
- [ ] Dashboard อัพเดท (รายรับ, กำไร)

### ทดสอบ "ตัด" → "ตัดขายให้เจ้าอื่น"
- [ ] คลิกปุ่ม "ตัด" → Modal เลือกประเภทเปิด
- [ ] แสดงข้อมูลเครื่องถูกต้อง
- [ ] คลิก "ตัดขายให้เจ้าอื่น" → Modal แก้ไขราคาเปิด
- [ ] แก้ไขราคา → ผลต่างคำนวณ Real-time
- [ ] กรอกหมายเหตุได้
- [ ] คลิก "บันทึก" → บันทึกสำเร็จ
- [ ] ข้อมูลย้ายไป Tab "ตัดออก"
- [ ] Dashboard อัพเดท

### ทดสอบ "ตัด" → "ตัดสลับไปร้านตัวเอง"
- [ ] คลิกปุ่ม "ตัด" → Modal เลือกประเภทเปิด
- [ ] คลิก "ตัดสลับไปร้านตัวเอง"
- [ ] แสดง Confirm ชื่อร้านปลายทาง
- [ ] คลิก "ตกลง" → ย้ายสำเร็จ
- [ ] เครื่องหายจากร้านปัจจุบัน
- [ ] เครื่องไปอยู่สต๊อคของร้านใหม่

### ทดสอบ "ย้ายกลับสต๊อค"
- [ ] จาก Tab "ขายแล้ว" คลิก "↩ ย้ายกลับสต๊อค"
- [ ] แสดง Confirm
- [ ] คลิก "ตกลง" → ย้ายสำเร็จ
- [ ] เครื่องกลับไป Tab "สต๊อค"
- [ ] Dashboard อัพเดท

## 📁 ไฟล์ที่แก้ไข

| ไฟล์ | จำนวนบรรทัด | สิ่งที่แก้ไข |
|------|-------------|--------------|
| `script.js` | ~100 บรรทัด | แก้ไข 6 ฟังก์ชัน |

## 🎉 สรุป

✅ **ระบบเครื่องมือสองมีฟังก์ชันการทำงานเหมือนเครื่องใหม่ 100%**

✅ **Modal ครบทุกฟังก์ชัน**

✅ **UX/UI สอดคล้องกัน**

✅ **คำนวณกำไร/ขาดทุน Real-time**

✅ **ใช้งานง่าย ชัดเจน**

✅ **พร้อมใช้งานจริง!**

---

**เวอร์ชั่น:** 1.1  
**อัพเดท:** 31 ตุลาคม 2025  
**ระบบ:** iLovePhone Store Management System

