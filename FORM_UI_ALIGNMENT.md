# ปรับปรุง UI ฟอร์ม - จัด Alignment ให้สวยงาม

## ปัญหาเดิม

- Label และ Input ไม่อยู่ในระดับเดียวกัน
- ความสูงของ Input ไม่เท่ากัน
- ระยะห่างระหว่างช่องไม่สม่ำเสมอ
- Select dropdown ไม่มี icon ลูกศร

## การแก้ไข

### 1. ปรับ Form Row ✅

```css
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;                    /* เพิ่มจาก 16px เป็น 20px */
    margin-bottom: 16px;
    align-items: start;           /* ใหม่: จัด alignment ให้เริ่มจากด้านบน */
}
```

### 2. ปรับ Form Group ให้เป็น Flexbox ✅

```css
.form-group {
    display: flex;
    flex-direction: column;       /* ใหม่: จัด label และ input เป็นแนวตั้ง */
}

.form-row .form-group {
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
}
```

### 3. กำหนดความสูงของ Label ✅

```css
.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    display: block;
    min-height: 21px;             /* ใหม่: กำหนดความสูงขั้นต่ำ */
}
```

### 4. กำหนดความสูงของ Input ให้เท่ากันทั้งหมด ✅

```css
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;                  /* ใหม่: กว้างเต็ม */
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.3s ease;
    box-sizing: border-box;       /* ใหม่: รวม padding และ border */
    height: 48px;                 /* ใหม่: กำหนดความสูงคงที่ */
}
```

### 5. เพิ่ม Dropdown Icon สำหรับ Select ✅

```css
.form-group select {
    appearance: none;             /* ใหม่: ลบ default style */
    background-image: url("data:image/svg+xml,..."); /* ใหม่: เพิ่ม icon ลูกศร */
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;          /* ใหม่: เผื่อพื้นที่สำหรับ icon */
}
```

### 6. ปรับ Textarea ให้มีความยืดหยุ่น ✅

```css
.form-group textarea {
    resize: vertical;
    min-height: 80px;
    height: auto;                 /* ใหม่: ให้ปรับความสูงได้ */
}
```

## ผลลัพธ์

### ✅ ก่อนแก้ไข:
```
ราคาทุน (฿)     [__________]
ยอดจัด (฿)                [__________]  ❌ ไม่ตรงแนว

เงินดาวน์ (฿)    [__________]
ค่าคอม (฿)                [__________]  ❌ ไม่ตรงแนว
```

### ✅ หลังแก้ไข:
```
ราคาทุน (฿)     [__________]  |  ยอดจัด (฿)     [__________]  ✓ ตรงแนว
เงินดาวน์ (฿)    [__________]  |  ค่าคอม (฿)      [__________]  ✓ ตรงแนว
งวดที่ผ่อน (งวด) [__________]  |  ยอดผ่อน/งวด (฿) [__________]  ✓ ตรงแนว
```

## คุณสมบัติใหม่

✅ **Label ทุกอันมีความสูงเท่ากัน** - กำหนด `min-height: 21px`
✅ **Input ทุกอันมีความสูงเท่ากัน** - กำหนด `height: 48px`
✅ **ระยะห่างสม่ำเสมอ** - กำหนด `gap: 20px`
✅ **จัด Alignment แนวตั้ง** - ใช้ `flexbox` และ `align-items: start`
✅ **Select มี Icon ลูกศร** - เพิ่ม custom dropdown icon
✅ **Responsive** - บนมือถือจะกลับเป็น 1 คอลัมน์

## การทดสอบ

### 1. ทดสอบบน Desktop:
- เปิดฟอร์มเพิ่มรายการผ่อน
- ตรวจสอบว่า Label และ Input อยู่ในแนวเดียวกัน
- ตรวจสอบว่าความสูงของ Input เท่ากันทุกช่อง

### 2. ทดสอบบน Mobile:
- ลอง resize หน้าจอให้เล็กกว่า 768px
- ตรวจสอบว่า layout กลับเป็น 1 คอลัมน์

### 3. ทดสอบ Select Dropdown:
- คลิกที่ Select (RAM, ROM)
- ตรวจสอบว่ามี icon ลูกศรแสดง

## ไฟล์ที่แก้ไข

- ✅ `style.css` - ปรับ CSS สำหรับ form-row, form-group, input, select

## หมายเหตุ

- ใช้ `flexbox` สำหรับจัด alignment
- ใช้ `grid` สำหรับจัดแถว 2 คอลัมน์
- กำหนดความสูงคงที่เพื่อความสวยงาม
- รองรับ responsive design
- ใช้ SVG data URL สำหรับ dropdown icon

