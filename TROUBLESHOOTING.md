# 🔧 คู่มือแก้ไขปัญหา - iLovePhone Store

## 🚨 ปัญหา: เว็บไซต์เปิดไม่ขึ้น (http://localhost:8000)

### วิธีแก้ไขอย่างรวดเร็ว:

#### 1️⃣ ตรวจสอบสถานะเซิร์ฟเวอร์
```bash
cd /Users/chakkapong/Sites/ilovephone-store
./check-servers.sh
```

#### 2️⃣ Restart เซิร์ฟเวอร์
```bash
./restart-servers.sh
```

#### 3️⃣ Hard Refresh เบราว์เซอร์
- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R`

---

## 📋 คำสั่งที่มีให้ใช้

### ▶️ เริ่มเซิร์ฟเวอร์
```bash
./start-servers.sh
```

### ⏹️ หยุดเซิร์ฟเวอร์
```bash
./stop-servers.sh
```

### 🔄 Restart เซิร์ฟเวอร์
```bash
./restart-servers.sh
```

### 🔍 ตรวจสอบสถานะ
```bash
./check-servers.sh
```

---

## 🐛 ปัญหาที่พบบ่อยและวิธีแก้ไข

### ❌ ปัญหา 1: Frontend ไม่ทำงาน (Port 8000)

**อาการ:**
- เว็บไซต์ไม่โหลด
- แสดง "This site can't be reached"

**วิธีแก้:**
```bash
# 1. หยุด process ที่ค้างอยู่
lsof -t -i:8000 | xargs kill -9

# 2. เริ่มใหม่
cd /Users/chakkapong/Sites/ilovephone-store
python3 -m http.server 8000 &

# 3. ตรวจสอบ
curl -I http://localhost:8000
```

---

### ❌ ปัญหา 2: Backend API ไม่ทำงาน (Port 5001)

**อาการ:**
- เว็บโหลดได้แต่ไม่มีข้อมูล
- Console แสดง error "Failed to fetch"

**วิธีแก้:**
```bash
# 1. หยุด process ที่ค้างอยู่
lsof -t -i:5001 | xargs kill -9

# 2. เริ่มใหม่
cd /Users/chakkapong/Sites/ilovephone-store/server
node server.js &

# 3. ตรวจสอบ log
tail -f /tmp/backend-server.log

# 4. ทดสอบ API
curl http://localhost:5001/api/equipment
```

---

### ❌ ปัญหา 3: Database ไม่เชื่อมต่อ

**อาการ:**
- Backend แสดง error "Database connection failed"

**วิธีแก้:**
```bash
# 1. ตรวจสอบ MySQL ทำงานหรือไม่
mysql.server status

# 2. ถ้าหยุด ให้เริ่มใหม่
mysql.server start

# 3. ตรวจสอบ credentials ใน .env
cd /Users/chakkapong/Sites/ilovephone-store/server
cat .env

# 4. Restart backend
./restart-servers.sh
```

---

### ❌ ปัญหา 4: เบราว์เซอร์แสดงข้อมูลเก่า (Cache)

**อาการ:**
- แก้ไขโค้ดแล้วแต่ไม่เห็นการเปลี่ยนแปลง
- ตารางแสดงผลไม่ถูกต้อง

**วิธีแก้:**
```bash
# Hard Refresh
Mac: Cmd + Shift + R
Windows/Linux: Ctrl + Shift + R

# หรือเปิด DevTools
1. กด F12
2. คลิกขวาที่ปุ่ม Reload
3. เลือก "Empty Cache and Hard Reload"
```

---

### ❌ ปัญหา 5: Port ถูกใช้งานโดย Process อื่น

**อาการ:**
- Error: "EADDRINUSE: address already in use"

**วิธีแก้:**
```bash
# ดู process ที่ใช้ port
lsof -i :8000
lsof -i :5001

# หยุด process นั้นๆ
kill -9 <PID>

# หรือใช้คำสั่งรวม
lsof -t -i:8000 | xargs kill -9
lsof -t -i:5001 | xargs kill -9

# จากนั้น restart
./start-servers.sh
```

---

## 🔍 การตรวจสอบ Logs

### Frontend Log
```bash
tail -f /tmp/frontend-server.log
```

### Backend Log
```bash
tail -f /tmp/backend-server.log
```

### ดู Error ล่าสุด
```bash
# Backend errors
tail -100 /tmp/backend-server.log | grep -i error

# Check database connection
tail -100 /tmp/backend-server.log | grep -i database
```

---

## 🌐 การทดสอบเว็บไซต์

### ทดสอบ Frontend
```bash
# ตรวจสอบว่า server ตอบกลับ
curl -I http://localhost:8000

# ดาวน์โหลดหน้าแรก
curl http://localhost:8000 | head -20
```

### ทดสอบ Backend API
```bash
# ทดสอบ API endpoints
curl http://localhost:5001/api/equipment
curl http://localhost:5001/api/new-devices
curl http://localhost:5001/api/repairs
```

---

## 💡 เคล็ดลับป้องกันปัญหา

### 1. ใช้สคริปต์ที่เตรียมไว้
```bash
# เริ่มงานทุกวัน
./start-servers.sh

# ปิดงานทุกวัน
./stop-servers.sh

# ตรวจสอบก่อนใช้งาน
./check-servers.sh
```

### 2. ตั้งค่า Auto-start (Optional)
สร้างไฟล์ `~/.zshrc` หรือ `~/.bashrc`:
```bash
alias ilove-start="cd /Users/chakkapong/Sites/ilovephone-store && ./start-servers.sh"
alias ilove-stop="cd /Users/chakkapong/Sites/ilovephone-store && ./stop-servers.sh"
alias ilove-check="cd /Users/chakkapong/Sites/ilovephone-store && ./check-servers.sh"
```

### 3. Bookmark ใน Browser
- Frontend: http://localhost:8000
- Backend API: http://localhost:5001/api/equipment

---

## 📞 ขั้นตอนการแก้ไขปัญหาทั่วไป

```
1. ตรวจสอบสถานะ
   └─> ./check-servers.sh

2. ถ้าเซิร์ฟเวอร์หยุด
   └─> ./start-servers.sh

3. ถ้าเซิร์ฟเวอร์ทำงานแต่เว็บไม่โหลด
   └─> Hard Refresh (Cmd+Shift+R)

4. ถ้ายังไม่ได้
   └─> ./restart-servers.sh

5. ถ้ายังมีปัญหา
   └─> ดู logs: tail -f /tmp/backend-server.log

6. ถ้า database error
   └─> mysql.server start
   └─> ./restart-servers.sh
```

---

## ✅ Checklist การตรวจสอบ

เมื่อเว็บไซต์เปิดไม่ขึ้น ให้ตรวจสอบตามลำดับ:

- [ ] เซิร์ฟเวอร์ Frontend ทำงานอยู่หรือไม่? (`lsof -i :8000`)
- [ ] เซิร์ฟเวอร์ Backend ทำงานอยู่หรือไม่? (`lsof -i :5001`)
- [ ] MySQL ทำงานอยู่หรือไม่? (`mysql.server status`)
- [ ] Browser cache ถูก clear แล้วหรือยัง? (Hard Refresh)
- [ ] มี error ใน console หรือไม่? (F12 → Console)
- [ ] Log มี error อะไรหรือไม่? (`tail -f /tmp/backend-server.log`)

---

**📅 Last Updated:** 19 พ.ย. 2568  
**🔧 Version:** 1.0

