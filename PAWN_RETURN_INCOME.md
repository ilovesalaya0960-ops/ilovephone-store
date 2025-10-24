# การแสดงรายการรับเครื่องคืนในหมวดรายรับ

## สิ่งที่เปลี่ยนแปลง

### 1. HTML Structure (index.html)

#### เพิ่มส่วนแสดงรายการรับเครื่องคืน
- เพิ่ม section ใหม่ `pawnReturnDetailsSection` ใต้ส่วน Income Breakdown
- แสดงแยกจากส่วนดอกเบี้ย (pawnDetailsSection)
- มีหัวข้อ "รายละเอียดการรับเครื่องคืน"

```html
<!-- Pawn Return Details Section -->
<div id="pawnReturnDetailsSection" class="pawn-details-section" style="display: none; margin-top: 30px;">
    <h3>รายละเอียดการรับเครื่องคืน</h3>
    <div id="pawnReturnDetailsContent" class="pawn-details-content">
        <!-- จะถูกเติมด้วย JavaScript -->
    </div>
    <div id="pawnReturnDetailsPagination" class="pagination">
        <!-- จะถูกเติมด้วย JavaScript -->
    </div>
</div>
```

### 2. JavaScript Logic (script.js)

#### แยกการแสดงรายการออกเป็น 2 ส่วน

**ฟังก์ชัน showPawnDetails()**
- เมื่อ type='income' จะเรียก 2 ฟังก์ชันคือ:
  1. `showPawnInterestDetails()` - แสดงรายการดอกเบี้ย
  2. `showPawnReturnDetails()` - แสดงรายการรับเครื่องคืน

**ฟังก์ชันใหม่:**

1. `getPawnInterestItems()` - ดึงข้อมูลดอกเบี้ยจาก API
2. `getPawnReturnItems()` - ดึงข้อมูลรับเครื่องคืนจาก API
   - กรองเฉพาะ status='returned' ที่มี return_date ในเดือนปัจจุบัน
   - แสดงข้อมูล: วันที่รับคืน, ลูกค้า, เครื่อง, ยอดฝาก, ดอกเบี้ย, วิธีเก็บดอก, ยอดไถ่ถอน

3. `displayPawnReturnItems()` - แสดงตารางรายการรับเครื่องคืน
   - แสดง header: วันที่, ลูกค้า, เครื่อง, ยอดฝาก, ดอกเบี้ย, วิธีเก็บดอก, ยอดไถ่ถอน
   - แสดง footer รวมยอดไถ่ถอนทั้งหมด

```javascript
async function showPawnReturnDetails() {
    const section = document.getElementById('pawnReturnDetailsSection');
    const content = document.getElementById('pawnReturnDetailsContent');
    
    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';
    
    const items = await getPawnReturnItems();
    displayPawnReturnItems(items);
}
```

### 3. CSS Styling (style.css)

#### เพิ่มสไตล์สำหรับส่วนรับเครื่องคืน

```css
#pawnReturnDetailsSection h3 {
    color: #059669;
    border-left: 4px solid #059669;
    padding-left: 1rem;
}

.pawn-details-table table tfoot tr {
    border-top: 2px solid #059669;
    font-weight: bold;
}

.pawn-details-table table tfoot td {
    padding: 1rem 0.75rem;
    font-size: 1.1rem;
}

.pawn-details-table table tfoot td.income {
    color: #059669;
    font-size: 1.2rem;
}
```

## การทำงาน

1. **เมื่อคลิกการ์ด "ขายฝาก" ในหมวดรายรับ:**
   - แสดง 2 sections:
     - **รายละเอียดดอกเบี้ยขายฝาก** - แสดงรายการหักดอก/ต่อดอก
     - **รายละเอียดการรับเครื่องคืน** - แสดงรายการที่ลูกค้ารับเครื่องคืนแล้ว

2. **รายการรับเครื่องคืนแสดง:**
   - วันที่ลูกค้ามารับเครื่องคืน (return_date)
   - ชื่อลูกค้า
   - รุ่นเครื่อง
   - ยอดฝากเดิม (pawn_amount)
   - ดอกเบี้ย 10% (interest)
   - วิธีเก็บดอก (หักดอก/ยังไม่หักดอก)
   - **ยอดไถ่ถอน (redemption_amount)** - เป็นยอดที่ลูกค้าจ่ายจริงเพื่อรับเครื่องคืน
   - แสดงผลรวมยอดไถ่ถอนทั้งหมด

3. **การคำนวณรายรับ:**
   ```javascript
   รายรับขายฝาก = ดอกเบี้ย + ยอดไถ่ถอน (redemption_amount)
   ```

## ตัวอย่างการแสดงผล

### ตารางรับเครื่องคืน:

| วันที่ | ลูกค้า | เครื่อง | ยอดฝาก | ดอกเบี้ย | วิธีเก็บดอก | ยอดไถ่ถอน |
|--------|--------|---------|---------|----------|-------------|------------|
| 22 ต.ค. 2568 | สิงคม | Infinix hot60pro | ฿1,200 | ฿120 | หักดอก | **฿1,200** |
| 21 ต.ค. 2568 | นางบุญจง สมนก้า | Apple ipad genn11 | ฿4,000 | ฿400 | ยังไม่หักดอก | **฿4,400** |
|  |  |  |  |  | **รวมยอดรับคืน:** | **฿5,600** |

## หมายเหตุ

- **ยอดไถ่ถอน** คือยอดที่แสดงในการ์ดรายรับ ไม่ใช่ยอดฝาก
- ถ้าเลือก "หักดอก" ยอดไถ่ถอน = ยอดฝาก
- ถ้าเลือก "ยังไม่หักดอก" ยอดไถ่ถอน = ยอดฝาก + ดอกเบี้ย
- รายการแสดงเฉพาะรายการที่มี status='returned' และมี return_date ในเดือนที่เลือก

## ประโยชน์

1. แยกแสดงรายรับจากดอกเบี้ยและการรับเครื่องคืนได้ชัดเจน
2. เห็นรายละเอียดว่าลูกค้าคนไหนมารับเครื่องคืนเมื่อไหร่
3. รู้ยอดเงินที่ได้รับจริงจากการรับเครื่องคืน (redemption_amount)
4. สามารถตรวจสอบและตรวจทานรายรับได้ละเอียดมากขึ้น
