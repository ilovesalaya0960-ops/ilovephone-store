# 📊 คู่มือ Database ระบบจัดการร้านไอเลิฟโฟน (ฉบับสมบูรณ์)

## 🏪 ข้อมูลทั่วไป

ระบบจัดการร้านไอเลิฟโฟนใช้ **LocalStorage** เป็นฐานข้อมูลหลัก แบ่งเป็น 6 ระบบหลัก:

1. **เครื่องใหม่** (New Devices) - `localStorage: 'newDevices'`
2. **เครื่องมือสอง** (Used Devices) - `localStorage: 'usedDevices'`
3. **เครื่องซ่อม** (Repair) - `localStorage: 'repairs'`
4. **เครื่องผ่อน** (Installment) - `localStorage: 'installmentDevices'`
5. **เครื่องขายฝาก** (Pawn) - `localStorage: 'pawnDevices'`
6. **อะไหล่** (Accessories) - `localStorage: 'accessories'`

### สถิติข้อมูลเริ่มต้น (Mock Data)

**ร้านศาลายา:**
- เครื่องใหม่: 12 รายการ (5 สต๊อก, 5 ขาย, 2 ตัดออก)
- เครื่องมือสอง: 8 รายการ (3 สต๊อก, 3 ขาย, 2 ตัดออก)
- เครื่องซ่อม: 5 รายการ (1 รอซ่อม, 1 กำลังซ่อม, 1 ซ่อมเสร็จ, 1 คืนแล้ว, 1 รับแล้ว)
- เครื่องผ่อน: 4 รายการ (2 ผ่อนอยู่, 1 ผ่อนครบ, 1 ยึดเครื่อง)
- เครื่องขายฝาก: 5 รายการ (3 ขายฝากอยู่, 1 รับคืน, 1 ยึดเครื่อง)
- อะไหล่: 8 รายการ (แบตเตอรี่ 3, จอ 2, บอร์ดชาร์จ 2, สวิตช์ 1)

**ร้านคลองโยง:**
- เครื่องใหม่: 8 รายการ (4 สต๊อก, 3 ขาย, 1 ตัดออก)
- เครื่องมือสอง: 6 รายการ (2 สต๊อก, 2 ขาย, 2 ตัดออก)
- เครื่องซ่อม: 3 รายการ (1 รอซ่อม, 1 ซ่อมเสร็จ, 1 คืนแล้ว)
- เครื่องผ่อน: 2 รายการ (1 ผ่อนอยู่, 1 ผ่อนครบ)
- เครื่องขายฝาก: 3 รายการ (2 ขายฝากอยู่, 1 รับคืน)
- อะไหล่: 5 รายการ (แบตเตอรี่ 2, จอ 1, บอร์ดชาร์จ 1, สวิตช์ 1)

**รวมทั้งหมด: 61 รายการ**

---

## 🔧 คำสั่งจัดการ Database (Console)

เปิด Developer Console (F12) แล้วใช้คำสั่งดังนี้:

### คำสั่งทั่วไป

```javascript
// ดูข้อมูลทั้งหมด
localStorage
```

```javascript
// ดูข้อมูลแต่ละระบบ
JSON.parse(localStorage.getItem('newDevices'))
JSON.parse(localStorage.getItem('usedDevices'))
JSON.parse(localStorage.getItem('repairs'))
JSON.parse(localStorage.getItem('installmentDevices'))
JSON.parse(localStorage.getItem('pawnDevices'))
JSON.parse(localStorage.getItem('accessories'))
```

```javascript
// ลบข้อมูลทั้งหมด (ระวัง!)
localStorage.clear()
location.reload()
```

### เครื่องใหม่ (New Devices)

```javascript
// ดูสถิติ
showNewDevicesStats()

// รีเซ็ตกลับเป็นข้อมูลเริ่มต้น
resetNewDevicesDB()

// ลบข้อมูลทั้งหมด
clearNewDevicesDB()

// ส่งออก Backup
exportNewDevicesDB()
```

### ดูสถิติแต่ละระบบ

```javascript
// นับจำนวนเครื่องมือสอง
const usedDevices = JSON.parse(localStorage.getItem('usedDevices'));
console.log('สต๊อก:', usedDevices.filter(d => d.status === 'stock').length);
console.log('ขายแล้ว:', usedDevices.filter(d => d.status === 'sold').length);
```

```javascript
// นับจำนวนเครื่องซ่อม
const repairs = JSON.parse(localStorage.getItem('repairs'));
console.log('รอซ่อม:', repairs.filter(r => r.status === 'pending').length);
console.log('กำลังซ่อม:', repairs.filter(r => r.status === 'in-repair').length);
console.log('ซ่อมเสร็จ:', repairs.filter(r => r.status === 'completed').length);
```

```javascript
// นับจำนวนเครื่องผ่อน
const installments = JSON.parse(localStorage.getItem('installmentDevices'));
console.log('ผ่อนอยู่:', installments.filter(i => i.status === 'active').length);
console.log('ผ่อนครบ:', installments.filter(i => i.status === 'completed').length);
console.log('ยึดเครื่อง:', installments.filter(i => i.status === 'seized').length);
```

```javascript
// นับจำนวนอะไหล่
const accessories = JSON.parse(localStorage.getItem('accessories'));
console.log('แบตเตอรี่:', accessories.filter(a => a.type === 'battery' && a.quantity > 0).length);
console.log('จอ:', accessories.filter(a => a.type === 'screen' && a.quantity > 0).length);
console.log('หมดสต็อก:', accessories.filter(a => a.quantity === 0).length);
```

---

## 📝 โครงสร้างข้อมูล (Schema)

### 1. เครื่องใหม่ (newDevices)

```javascript
{
  id: "1001",
  brand: "Apple",
  model: "iPhone 15 Pro Max",
  color: "Titanium Natural",
  imei: "358234567891234",
  ram: "8",
  rom: "256",
  purchasePrice: 42000,
  importDate: "2025-10-01",
  salePrice: 46900,
  saleDate: null,
  status: "stock",  // "stock" | "sold" | "removed"
  note: "",
  store: "salaya",  // "salaya" | "klongyong"
  createdAt: "2025-10-01T10:00:00Z"
}
```

### 2. เครื่องมือสอง (usedDevices)

```javascript
{
  id: "U1001",
  brand: "Apple",
  model: "iPhone 12 Pro",
  color: "Pacific Blue",
  imei: "358234567895001",
  ram: "6",
  rom: "128",
  condition: "ดีมาก",
  purchasePrice: 18000,
  importDate: "2025-09-01",
  salePrice: 22900,
  saleDate: null,
  status: "stock",  // "stock" | "sold" | "removed"
  note: "",
  store: "salaya",
  createdAt: "2025-09-01T10:00:00Z"
}
```

### 3. เครื่องซ่อม (repairs)

```javascript
{
  id: "R1001",
  brand: "Apple",
  model: "iPhone 13",
  color: "Midnight",
  imei: "358234567897001",
  customerName: "สมชาย ใจดี",
  customerPhone: "0812345678",
  problem: "หน้าจอแตก",
  repairCost: 4500,
  receivedDate: "2025-10-01",
  appointmentDate: "2025-10-05",
  completedDate: null,
  returnedDate: null,
  status: "pending",  // "pending" | "in-repair" | "completed" | "returned" | "received"
  note: "",
  store: "salaya",
  createdAt: "2025-10-01T09:00:00Z"
}
```

### 4. เครื่องผ่อน (installmentDevices)

```javascript
{
  id: "I1001",
  brand: "Apple",
  model: "iPhone 14",
  color: "Blue",
  imei: "358234567896001",
  ram: "6",
  rom: "128",
  customerName: "สมชาย ใจดี",
  customerPhone: "0812345678",
  costPrice: 28000,
  salePrice: 35000,
  downPayment: 5000,
  totalInstallments: 10,
  installmentAmount: 3000,
  paidInstallments: 3,
  downPaymentDate: "2025-09-01",
  completedDate: null,
  seizedDate: null,
  paymentHistory: [
    { installmentNumber: 1, paymentDate: "2025-10-01", amount: 3000 },
    { installmentNumber: 2, paymentDate: "2025-10-31", amount: 3000 }
  ],
  note: "",
  status: "active",  // "active" | "completed" | "seized"
  store: "salaya",
  createdAt: "2025-09-01T10:00:00Z"
}
```

### 5. เครื่องขายฝาก (pawnDevices)

```javascript
{
  id: "P1001",
  brand: "Apple",
  model: "iPhone 14 Pro",
  color: "Deep Purple",
  imei: "358234567898001",
  ram: "6",
  rom: "256",
  pawnAmount: 25000,
  interest: 1000,
  receiveDate: "2025-09-15",
  dueDate: "2025-09-30",
  returnDate: null,
  seizedDate: null,
  note: "",
  status: "active",  // "active" | "returned" | "seized"
  store: "salaya",
  createdAt: "2025-09-15T10:00:00Z"
}
```

### 6. อะไหล่ (accessories)

```javascript
{
  id: "ACC1001",
  type: "battery",  // "battery" | "screen" | "charging" | "switch"
  code: "BAT-IP14-001",
  brand: "Apple",
  models: "iPhone 14",
  quantity: 5,
  costPrice: 800,
  repairPrice: 1500,
  importDate: "2025-09-01",
  note: "",
  store: "salaya",
  createdAt: "2025-09-01T10:00:00Z"
}
```

---

## 💾 การ Backup & Restore

### Backup ข้อมูลทั้งหมด

```javascript
function backupAllData() {
    const backup = {
        newDevices: localStorage.getItem('newDevices'),
        usedDevices: localStorage.getItem('usedDevices'),
        repairs: localStorage.getItem('repairs'),
        installmentDevices: localStorage.getItem('installmentDevices'),
        pawnDevices: localStorage.getItem('pawnDevices'),
        accessories: localStorage.getItem('accessories'),
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-all-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// เรียกใช้
backupAllData()
```

### Restore ข้อมูล

```javascript
// วิธีที่ 1: Restore ทีละระบบ
const backupData = { /* ข้อมูล JSON ของคุณ */ };
localStorage.setItem('newDevices', backupData.newDevices);
localStorage.setItem('usedDevices', backupData.usedDevices);
localStorage.setItem('repairs', backupData.repairs);
localStorage.setItem('installmentDevices', backupData.installmentDevices);
localStorage.setItem('pawnDevices', backupData.pawnDevices);
localStorage.setItem('accessories', backupData.accessories);
location.reload();
```

```javascript
// วิธีที่ 2: Restore ทั้งหมดพร้อมกัน
function restoreAllData(backupData) {
    Object.keys(backupData).forEach(key => {
        if (key !== 'timestamp') {
            localStorage.setItem(key, backupData[key]);
        }
    });
    location.reload();
}
```

---

## 📈 การคำนวณและวิเคราะห์

### คำนวณกำไรเครื่องใหม่

```javascript
const newDevices = JSON.parse(localStorage.getItem('newDevices'));
const profit = newDevices
    .filter(d => d.status === 'sold')
    .reduce((sum, d) => sum + (d.salePrice - d.purchasePrice), 0);
console.log('กำไรจากเครื่องใหม่:', profit.toLocaleString(), 'บาท');
```

### คำนวณยอดผ่อนค้างทั้งหมด

```javascript
const installments = JSON.parse(localStorage.getItem('installmentDevices'));
const totalRemaining = installments
    .filter(i => i.status === 'active')
    .reduce((sum, i) => {
        const remaining = (i.totalInstallments - i.paidInstallments) * i.installmentAmount;
        return sum + remaining;
    }, 0);
console.log('ยอดผ่อนค้างทั้งหมด:', totalRemaining.toLocaleString(), 'บาท');
```

### คำนวณมูลค่าสต็อกอะไหล่

```javascript
const accessories = JSON.parse(localStorage.getItem('accessories'));
const stockValue = accessories
    .filter(a => a.quantity > 0)
    .reduce((sum, a) => sum + (a.costPrice * a.quantity), 0);
console.log('มูลค่าสต็อกอะไหล่:', stockValue.toLocaleString(), 'บาท');
```

### หาเครื่องที่ขายได้กำไรสูงสุด

```javascript
const allSold = [
    ...JSON.parse(localStorage.getItem('newDevices')).filter(d => d.status === 'sold'),
    ...JSON.parse(localStorage.getItem('usedDevices')).filter(d => d.status === 'sold')
];

const bestProfit = allSold
    .map(d => ({
        model: d.model,
        profit: d.salePrice - d.purchasePrice,
        type: d.id.startsWith('U') ? 'มือสอง' : 'ใหม่'
    }))
    .sort((a, b) => b.profit - a.profit)[0];

console.log('เครื่องที่กำไรสูงสุด:', bestProfit);
```

---

## 🎯 Tips & Tricks

### 1. ดูข้อมูลแบบตาราง

```javascript
const newDevices = JSON.parse(localStorage.getItem('newDevices'));
console.table(newDevices.map(d => ({
    รหัส: d.id,
    รุ่น: d.model,
    สถานะ: d.status,
    ราคาขาย: d.salePrice,
    ร้าน: d.store
})));
```

### 2. หาเครื่องที่ค้างชำระผ่อนนานที่สุด

```javascript
const installments = JSON.parse(localStorage.getItem('installmentDevices'));
const overdue = installments
    .filter(i => i.status === 'active')
    .map(i => {
        const nextDue = new Date(i.downPaymentDate);
        nextDue.setDate(nextDue.getDate() + (i.paidInstallments + 1) * 30);
        const today = new Date();
        const daysOverdue = Math.floor((today - nextDue) / (1000 * 60 * 60 * 24));
        return {
            ลูกค้า: i.customerName,
            เครื่อง: i.model,
            เกินกำหนด: daysOverdue > 0 ? `${daysOverdue} วัน` : 'ยังไม่เกิน'
        };
    })
    .filter(i => i.เกินกำหนด !== 'ยังไม่เกิน');
console.table(overdue);
```

### 3. นับจำนวนเครื่องแต่ละยี่ห้อ

```javascript
const allDevices = [
    ...JSON.parse(localStorage.getItem('newDevices')),
    ...JSON.parse(localStorage.getItem('usedDevices'))
];

const brandCount = allDevices.reduce((acc, d) => {
    acc[d.brand] = (acc[d.brand] || 0) + 1;
    return acc;
}, {});

console.table(brandCount);
```

### 4. หาอะไหล่ที่ใกล้หมด (quantity < 3)

```javascript
const accessories = JSON.parse(localStorage.getItem('accessories'));
const lowStock = accessories
    .filter(a => a.quantity > 0 && a.quantity < 3)
    .map(a => ({
        รหัส: a.code,
        ยี่ห้อ: a.brand,
        จำนวนคงเหลือ: a.quantity,
        ร้าน: a.store
    }));
console.table(lowStock);
```

### 5. Export สรุปยอดขายรายเดือน

```javascript
function getMonthlySales(month, year) {
    const allSold = [
        ...JSON.parse(localStorage.getItem('newDevices')).filter(d => d.status === 'sold'),
        ...JSON.parse(localStorage.getItem('usedDevices')).filter(d => d.status === 'sold')
    ];

    const monthlySales = allSold.filter(d => {
        const saleDate = new Date(d.saleDate);
        return saleDate.getMonth() + 1 === month && saleDate.getFullYear() === year;
    });

    const totalRevenue = monthlySales.reduce((sum, d) => sum + d.salePrice, 0);
    const totalProfit = monthlySales.reduce((sum, d) => sum + (d.salePrice - d.purchasePrice), 0);

    return {
        จำนวนเครื่อง: monthlySales.length,
        ยอดขายรวม: totalRevenue.toLocaleString() + ' บาท',
        กำไรรวม: totalProfit.toLocaleString() + ' บาท'
    };
}

// ใช้งาน: ดูยอดขายเดือน ตุลาคม 2568
console.log(getMonthlySales(10, 2025));
```

---

## 🚨 ข้อควรระวัง

1. **LocalStorage มีขีดจำกัด**: ประมาณ 5-10 MB ต่อ domain
2. **ข้อมูลจะหายเมื่อ Clear Browser Data**: Export สำรองเป็นประจำ
3. **ไม่รองรับการทำงานแบบ Multi-User**: ข้อมูลเก็บในเครื่องแต่ละเครื่อง
4. **ไม่มี Transaction Support**: ระวังการแก้ไขข้อมูลพร้อมกันหลายหน้าต่าง

---

## 📞 การแก้ปัญหา

### ข้อมูลหาย
```javascript
// 1. ตรวจสอบว่ามีข้อมูลหรือไม่
Object.keys(localStorage);

// 2. ถ้ายังมี ให้ Export ออกมาก่อน
exportNewDevicesDB();

// 3. รีเซ็ตข้อมูลเริ่มต้น
resetNewDevicesDB();
```

### ข้อมูลซ้ำ
```javascript
// ลบข้อมูลซ้ำ (ตัวอย่าง: เครื่องใหม่)
const newDevices = JSON.parse(localStorage.getItem('newDevices'));
const unique = Array.from(new Map(newDevices.map(d => [d.id, d])).values());
localStorage.setItem('newDevices', JSON.stringify(unique));
location.reload();
```

### ข้อมูลผิดพลาด
```javascript
// ล้างข้อมูลทั้งหมดและเริ่มใหม่
localStorage.clear();
location.reload();
```

---

## 📊 สรุปคำสั่งที่ใช้บ่อย

```javascript
// Backup ทั้งหมด
backupAllData()

// ดูสถิติเครื่องใหม่
showNewDevicesStats()

// รีเซ็ตข้อมูลเครื่องใหม่
resetNewDevicesDB()

// ดูข้อมูลทั้งหมด
localStorage

// ลบข้อมูลทั้งหมด (ระวัง!)
localStorage.clear()
```

---

**อัพเดทล่าสุด**: ตุลาคม 2568
**เวอร์ชัน**: 1.0
