# อัปเดตหน้าซิมการ์ด - เพิ่มการกรองตามค่าย

## 🎯 การเปลี่ยนแปลงหลัก:

### 1. เปลี่ยนแท็บ "คืนแล้ว" เป็น "หมดอายุ"
- ระบบจะตรวจสอบวันที่หมดอายุอัตโนมัติ
- ซิมที่หมดอายุจะถูกแยกไปแสดงในแท็บ "หมดอายุ"
- เปรียบเทียบวันที่หมดอายุกับวันที่ปัจจุบัน

### 2. เพิ่มแท็บแถวที่ 2 - กรองตามค่าย
แถวใหม่สำหรับกรองซิมการ์ดตามค่าย:
- 📱 ทั้งหมด
- 📱 AIS
- 📱 DTAC
- 📱 TRUE

## 📝 รายละเอียดการแก้ไข:

### HTML Changes (`index.html`)

#### 1. แท็บแถวที่ 1 (บรรทัด 2858-2869)
```html
<!-- Tabs: แถวที่ 1 - สถานะซิมการ์ด -->
<div class="tabs">
    <button type="button" class="tab-btn active" data-tab="simcard-available" onclick="switchSimcardTab('available')">
        พร้อมขาย <span class="badge" id="simcardAvailableCount">0</span>
    </button>
    <button type="button" class="tab-btn" data-tab="simcard-sold" onclick="switchSimcardTab('sold')">
        ขายแล้ว <span class="badge" id="simcardSoldCount">0</span>
    </button>
    <button type="button" class="tab-btn" data-tab="simcard-expired" onclick="switchSimcardTab('expired')">
        หมดอายุ <span class="badge" id="simcardExpiredCount">0</span>
    </button>
</div>
```

#### 2. แท็บแถวที่ 2 - ค่าย (บรรทัด 2871-2885)
```html
<!-- Tabs: แถวที่ 2 - ค่าย -->
<div class="tabs brand-tabs" id="simcardProviderTabs">
    <button class="tab-btn brand-tab-btn active" onclick="switchSimcardProvider('ทั้งหมด', event)">
        📱 ทั้งหมด <span class="badge" id="providerAllCount">0</span>
    </button>
    <button class="tab-btn brand-tab-btn" onclick="switchSimcardProvider('AIS', event)">
        📱 AIS <span class="badge" id="providerAISCount">0</span>
    </button>
    <button class="tab-btn brand-tab-btn" onclick="switchSimcardProvider('DTAC', event)">
        📱 DTAC <span class="badge" id="providerDTACCount">0</span>
    </button>
    <button class="tab-btn brand-tab-btn" onclick="switchSimcardProvider('TRUE', event)">
        📱 TRUE <span class="badge" id="providerTRUECount">0</span>
    </button>
</div>
```

#### 3. แท็บ "หมดอายุ" (บรรทัด 2934-2955)
```html
<div class="tab-content" id="simcard-expired-tab">
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ผู้ให้บริการ</th>
                    <th>เบอร์โทร</th>
                    <th>แพ็กเกจ</th>
                    <th>ราคาทุน</th>
                    <th>ราคาขาย</th>
                    <th>วันที่หมดอายุ</th>
                    <th>การจัดการ</th>
                </tr>
            </thead>
            <tbody id="simcardExpiredTableBody">
                <tr><td colspan="7" class="empty-state">ไม่มีข้อมูล</td></tr>
            </tbody>
        </table>
    </div>
</div>
```

### JavaScript Changes (`script.js`)

#### 1. เพิ่มตัวแปร Global (บรรทัด 22-23)
```javascript
let currentSimcardTab = 'available'; // Current simcard tab (available, sold, expired)
let currentSimcardProvider = 'ทั้งหมด'; // Current simcard provider filter
```

#### 2. ฟังก์ชัน `loadSimcardData()` - อัปเดตการกรอง
```javascript
async function loadSimcardData() {
    const simcards = await API.get(`${API_ENDPOINTS.simcard}?store=${currentStore}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // แยกซิมที่พร้อมขาย (ยังไม่หมดอายุ)
    const available = simcards.filter(s => {
        const isAvailable = s.status === 'available';
        const expiryDate = s.expiry_date ? new Date(s.expiry_date) : null;
        const isExpired = expiryDate && expiryDate < today;
        return isAvailable && !isExpired;
    });

    // ซิมที่ขายแล้ว
    const sold = simcards.filter(s => s.status === 'sold');

    // ซิมที่หมดอายุ (status='available' แต่หมดอายุแล้ว)
    const expired = simcards.filter(s => {
        const expiryDate = s.expiry_date ? new Date(s.expiry_date) : null;
        return s.status === 'available' && expiryDate && expiryDate < today;
    });

    // กรองตามค่ายที่เลือก
    const filteredAvailable = filterByProvider(available, currentSimcardProvider);
    const filteredSold = filterByProvider(sold, currentSimcardProvider);
    const filteredExpired = filterByProvider(expired, currentSimcardProvider);

    // แสดงผล
    displaySimcards(filteredAvailable, 'simcardAvailableTableBody', 'available');
    displaySimcards(filteredSold, 'simcardSoldTableBody', 'sold');
    displaySimcards(filteredExpired, 'simcardExpiredTableBody', 'expired');

    // อัปเดตตัวนับ
    updateSimcardTabCounts({ available, sold, expired });
    updateSimcardProviderCounts({ available, sold, expired });
}
```

#### 3. ฟังก์ชันใหม่

**`filterByProvider()`** - กรองตามค่าย
```javascript
function filterByProvider(simcards, provider) {
    if (provider === 'ทั้งหมด') return simcards;
    return simcards.filter(s => s.provider === provider);
}
```

**`switchSimcardTab()`** - สลับแท็บสถานะ
```javascript
function switchSimcardTab(tab) {
    currentSimcardTab = tab;
    // อัปเดต UI
}
```

**`switchSimcardProvider()`** - สลับค่าย
```javascript
function switchSimcardProvider(provider, event) {
    currentSimcardProvider = provider;
    loadSimcardData(); // โหลดข้อมูลใหม่
}
```

**`updateSimcardProviderCounts()`** - อัปเดตตัวนับค่าย
```javascript
function updateSimcardProviderCounts(data) {
    const allSimcards = [...data.available, ...data.sold, ...data.expired];
    // นับจำนวนแต่ละค่าย
}
```

## 🧪 วิธีทดสอบ:

### ขั้นตอนที่ 1: Clear Cache
กด **Cmd + Shift + R** (Mac) หรือ **Ctrl + Shift + R** (Windows)

### ขั้นตอนที่ 2: ทดสอบการกรองตามค่าย
1. เปิดหน้าซิมการ์ด
2. เพิ่มซิมการ์ดหลายค่าย (AIS, DTAC, TRUE)
3. คลิกแท็บค่ายต่างๆ ในแถวที่ 2
4. ตรวจสอบว่าแสดงเฉพาะซิมของค่ายที่เลือก

### ขั้นตอนที่ 3: ทดสอบแท็บ "หมดอายุ"
1. เพิ่มซิมการ์ดใหม่โดยตั้งวันหมดอายุเป็นอดีต (เช่น 2023-01-01)
2. คลิกแท็บ "หมดอายุ"
3. ตรวจสอบว่าซิมที่หมดอายุแสดงในแท็บนี้

## 📊 ตัวอย่างข้อมูล:

| ค่าย | เบอร์ | วันนำเข้า | วันหมดอายุ | แท็บที่แสดง |
|------|-------|-----------|------------|-------------|
| AIS | 081-111-1111 | 2024-11-26 | 2025-11-26 | พร้อมขาย |
| DTAC | 082-222-2222 | 2024-11-26 | 2025-11-26 | พร้อมขาย |
| TRUE | 089-333-3333 | 2024-11-26 | 2023-11-26 | หมดอายุ |
| AIS | 081-444-4444 | 2024-11-20 | - | ขายแล้ว (sold) |

## 💡 หมายเหตุ:

- ซิมที่หมดอายุยังคง status='available' ในฐานข้อมูล
- ระบบแยกซิมหมดอายุโดยเช็ควันที่หมดอายุกับวันปัจจุบัน
- การกรองค่ายทำงานร่วมกับทุกแท็บ (พร้อมขาย, ขายแล้ว, หมดอายุ)
- ตัวนับในแต่ละแท็บแสดงจำนวนทั้งหมด (ไม่กรองตามค่าย)
- ตัวนับค่ายแสดงจำนวนรวมทุกสถานะ

## 📂 ไฟล์ที่แก้ไข:

- `index.html` (บรรทัด 2858-2955)
- `script.js` (บรรทัด 22-23, 23441-23703)

## ✅ Cache Version:

อัปเดตเป็น: `1764143314`
