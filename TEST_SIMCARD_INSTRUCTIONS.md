# วิธีทดสอบฟังก์ชันเพิ่มซิมการ์ด

## ปัญหาที่พบและแก้ไขแล้ว:
❌ **ปัญหา**: `Cannot access 'currentSimcardEditId' before initialization`
✅ **แก้ไข**: ย้ายการประกาศตัวแปร `currentSimcardEditId` ไปไว้ด้านบนสุดของไฟล์ (line 21) และลบการประกาศซ้ำออก

## การเปลี่ยนแปลงที่ทำ:

### 1. ย้ายการประกาศตัวแปร (script.js:21)
```javascript
let currentSimcardEditId = null; // Current editing simcard ID (global scope to avoid TDZ error)
```

### 2. อัปเดต cache version (index.html:6591)
```html
<script src="script.js?v=1764142470"></script>
```

## วิธีทดสอบ:

### ขั้นตอนที่ 1: Clear Browser Cache
1. กด **Cmd + Shift + R** (Mac) หรือ **Ctrl + Shift + R** (Windows)
2. หรือเปิด DevTools (F12) → คลิกขวาที่ปุ่ม Reload → เลือก **"Empty Cache and Hard Reload"**

### ขั้นตอนที่ 2: ทดสอบหน้าหลัก
1. เปิด: http://localhost:8000
2. ไปที่หน้า **ซิมการ์ด**
3. คลิกปุ่ม **"+ เพิ่มซิมการ์ด"**
4. ฟอร์มควรจะเปิดขึ้นมาโดยไม่มี error

### ขั้นตอนที่ 3: กรอกข้อมูลทดสอบ
1. เลือก **ค่าย**: AIS
2. กรอก **เบอร์**: 081-234-5678
3. เลือก **วันที่นำเข้า**: วันที่ปัจจุบัน
4. เลือก **วันที่หมดอายุ**: วันที่ในอนาคต (เช่น 1 ปีข้างหน้า)
5. คลิก **"ตกลง"**

### ขั้นตอนที่ 4: ตรวจสอบ Console (Optional)
1. กด **F12** เพื่อเปิด DevTools
2. ไปที่แท็บ **Console**
3. ตรวจสอบว่าไม่มี error สีแดง

## ไฟล์ Debug (สำหรับทดสอบเพิ่มเติม):

### 1. debug_simcard.html
```bash
open debug_simcard.html
```
- ทดสอบว่าฟังก์ชันและตัวแปรถูกโหลดถูกต้อง
- แสดง error logs ถ้ามี

### 2. test_simcard_add.sh
```bash
./test_simcard_add.sh
```
- ทดสอบ Backend API โดยตรง
- ตรวจสอบว่าข้อมูลถูกบันทึกในฐานข้อมูลถูกต้อง

## คาดหวังผลลัพธ์:

✅ **ถ้าสำเร็จ**:
- Modal เปิดขึ้นมาไม่มี error
- กรอกข้อมูลได้ปกติ
- บันทึกข้อมูลสำเร็จ
- แสดงข้อความ "เพิ่มซิมการ์ดสำเร็จ"
- ข้อมูลปรากฏในตารางหน้าซิมการ์ด

❌ **ถ้ายังมีปัญหา**:
1. ตรวจสอบ Console Errors (F12)
2. ลองรัน `debug_simcard.html` เพื่อดูรายละเอียด
3. ลองใช้ Private/Incognito Mode
4. ลองปิดและเปิด browser ใหม่

## ข้อมูลเพิ่มเติม:

- **Backend Server**: http://localhost:5001
- **Frontend Server**: http://localhost:8000
- **Database**: MySQL (ilovephone_db)
- **Simcard Table**: มีคอลัมน์ `expiry_date` แล้ว

## หากยังมีปัญหา:

กรุณาแจ้งข้อความ error ที่แสดงใน Console พร้อมกับ:
- ข้อความ error ที่เห็น
- ขั้นตอนที่ทำก่อนเกิด error
- Browser และเวอร์ชันที่ใช้
