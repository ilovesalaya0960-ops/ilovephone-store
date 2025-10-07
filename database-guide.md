# คู่มือการใช้งาน Database ระบบจัดการเครื่องใหม่

## 📊 ข้อมูลเบื้องต้น

ระบบจัดการเครื่องใหม่ใช้ **LocalStorage** เป็นฐานข้อมูลหลัก โดยมีข้อมูลเริ่มต้น (Mock Data) ดังนี้:

### ร้านศาลายา
- **สต๊อก**: 5 เครื่อง
- **ขายแล้ว**: 5 เครื่อง
- **ตัดออก**: 2 เครื่อง
- **รวม**: 12 รายการ

### ร้านคลองโยง
- **สต๊อก**: 4 เครื่อง
- **ขายแล้ว**: 3 เครื่อง
- **ตัดออก**: 1 เครื่อง
- **รวม**: 8 รายการ

### ข้อมูลทั้งหมด
**รวมทั้ง 2 ร้าน**: 20 รายการ

---

## 🔧 คำสั่งจัดการ Database (Console)

เปิด Developer Console (F12) แล้วใช้คำสั่งดังนี้:

### 1. ดูสถิติฐานข้อมูล
```javascript
showNewDevicesStats()
```
แสดงสถิติทั้งหมด รวมถึงมูลค่าสต๊อก, ยอดขาย, และกำไร

### 2. รีเซ็ตฐานข้อมูล
```javascript
resetNewDevicesDB()
```
รีเซ็ตฐานข้อมูลกลับไปเป็นข้อมูลเริ่มต้น (20 รายการ)

### 3. ลบข้อมูลทั้งหมด
```javascript
clearNewDevicesDB()
```
ลบข้อมูลทั้งหมด (เริ่มจาก 0)

### 4. ส่งออกฐานข้อมูล
```javascript
exportNewDevicesDB()
```
ดาวน์โหลดไฟล์ JSON backup

---

## 📝 โครงสร้างข้อมูล (Schema)

```javascript
{
  id: "1001",                    // รหัสเฉพาะ (string)
  brand: "Apple",                // ยี่ห้อ
  model: "iPhone 15 Pro Max",   // รุ่น
  color: "Titanium Natural",    // สี
  imei: "358234567891234",      // IMEI (15 หลัก)
  ram: "8",                      // RAM (GB)
  rom: "256",                    // ROM (GB)
  purchasePrice: 42000,         // ราคาซื้อ (บาท)
  importDate: "2025-10-01",     // วันที่นำเข้า (YYYY-MM-DD)
  salePrice: 46900,             // ราคาขาย (บาท)
  saleDate: null,               // วันที่ขาย (null ถ้ายังไม่ขาย)
  status: "stock",              // สถานะ: "stock", "sold", "removed"
  note: "",                      // หมายเหตุ (ใช้กับสถานะ removed)
  store: "salaya",              // ร้าน: "salaya", "klongyong"
  createdAt: "2025-10-01T10:00:00Z"  // วันเวลาที่สร้าง
}
```

---

## 🎯 ตัวอย่างข้อมูลในระบบ

### เครื่องสต๊อก
- **iPhone 15 Pro Max** - Titanium Natural - 8/256GB - ฿46,900
- **Galaxy S24 Ultra** - Titanium Gray - 12/512GB - ฿42,900
- **Xiaomi 14 Pro** - Black - 12/256GB - ฿24,900
- **OPPO Find X7 Pro** - Ocean Blue - 16/512GB - ฿31,900
- **Vivo X100 Pro** - Asteroid Black - 12/256GB - ฿27,500

### เครื่องที่ขายแล้ว (พร้อมกำไร)
- **iPhone 15** - Pink - ซื้อ ฿28,000 → ขาย ฿32,900 = **กำไร ฿4,900**
- **Galaxy A54** - Awesome Violet - ซื้อ ฿11,000 → ขาย ฿13,900 = **กำไร ฿2,900**
- **Redmi Note 13 Pro** - Midnight Black - ซื้อ ฿8,500 → ขาย ฿10,900 = **กำไร ฿2,400**

### เครื่องที่ตัดออก
- **Galaxy Z Flip5** - Mint - หมายเหตุ: "หน้าจอแตก ซ่อมแล้วไม่คุ้ม"
- **Vivo V29** - Noble Black - หมายเหตุ: "เมนบอร์ดเสีย"

---

## 💾 การ Backup & Restore

### Backup ข้อมูล
1. เปิด Console (F12)
2. พิมพ์: `exportNewDevicesDB()`
3. ไฟล์ JSON จะถูกดาวน์โหลดอัตโนมัติ

### Restore ข้อมูล
1. สร้างปุ่ม Import ในหน้า UI หรือ
2. ใช้โค้ดด้านล่างใน Console:

```javascript
// วาง JSON ข้อมูลที่ต้องการ restore
const backupData = [...]; // ข้อมูล JSON ของคุณ
localStorage.setItem('newDevices', JSON.stringify(backupData));
location.reload(); // รีเฟรชหน้าเว็บ
```

---

## 🔍 การค้นหาข้อมูล

ระบบรองรับการค้นหาในฟิลด์:
- ยี่ห้อ (brand)
- รุ่น (model)
- สี (color)
- IMEI
- RAM/ROM (เช่น "8/256")

ตัวอย่าง:
- พิมพ์ "iPhone" → แสดงเฉพาะเครื่อง Apple
- พิมพ์ "Purple" → แสดงเครื่องสีม่วง
- พิมพ์ "12/256" → แสดงเครื่อง RAM 12GB, ROM 256GB

---

## 📈 การคำนวณกำไร

กำไรคำนวณจาก:
```
กำไร = ราคาขาย - ราคาซื้อ
```

- **สีเขียว**: กำไร (กำไร ≥ 0)
- **สีแดง**: ขาดทุน (กำไร < 0)

---

## ⚙️ การตั้งค่าเพิ่มเติม

### เพิ่มร้านใหม่
แก้ไขในไฟล์ `script.js`:

```javascript
const stores = {
    salaya: 'ร้านไอเลิฟโฟน - ศาลายา',
    klongyong: 'ร้านไอเลิฟโฟน - คลองโยง',
    newstore: 'ร้านไอเลิฟโฟน - สาขาใหม่'  // เพิ่มที่นี่
};
```

### เพิ่มตัวเลือก RAM/ROM
แก้ไขในไฟล์ `index.html`:

```html
<select id="ram" name="ram" required>
    <option value="32">32 GB</option>  <!-- เพิ่มที่นี่ -->
</select>
```

---

## 🚨 ข้อควรระวัง

1. **LocalStorage มีขีดจำกัด**: ประมาณ 5-10 MB ต่อ domain
2. **ข้อมูลจะหายเมื่อ Clear Browser Data**: ควร Export สำรองเป็นประจำ
3. **ไม่รองรับการทำงานแบบ Multi-User**: หากต้องการ ควรพัฒนา Backend API

---

## 🎓 Tips & Tricks

### 1. ดูข้อมูล LocalStorage
```javascript
console.log(JSON.parse(localStorage.getItem('newDevices')));
```

### 2. นับจำนวนเครื่องแต่ละยี่ห้อ
```javascript
const brands = JSON.parse(localStorage.getItem('newDevices'))
    .reduce((acc, d) => {
        acc[d.brand] = (acc[d.brand] || 0) + 1;
        return acc;
    }, {});
console.table(brands);
```

### 3. หาเครื่องที่ขายได้กำไรสูงสุด
```javascript
const sold = JSON.parse(localStorage.getItem('newDevices'))
    .filter(d => d.status === 'sold')
    .map(d => ({
        model: d.model,
        profit: d.salePrice - d.purchasePrice
    }))
    .sort((a, b) => b.profit - a.profit);
console.table(sold);
```

---

## 📞 ติดต่อสอบถาม

หากมีปัญหาหรือข้อสงสัยเกี่ยวกับระบบ:
- ตรวจสอบ Console (F12) หาข้อความ error
- ลองรีเซ็ตฐานข้อมูล: `resetNewDevicesDB()`
- ตรวจสอบว่ามีข้อมูลใน LocalStorage: `localStorage.getItem('newDevices')`
