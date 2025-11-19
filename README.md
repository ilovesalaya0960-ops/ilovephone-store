# 🏪 iLovePhone Store - ระบบจัดการร้านค้ามือถือ

ระบบจัดการร้านค้ามือถือแบบครบวงจร รองรับการขายเครื่องใหม่ เครื่องมือสอง ซ่อม ผ่อนชำระ และจำนำ

---

## 🚀 เริ่มใช้งานด่วน (Quick Start)

### 1. เริ่มเซิร์ฟเวอร์และเปิดเว็บ
```bash
cd /Users/chakkapong/Sites/ilovephone-store
./open-website.sh
```

### 2. หรือทำแยกขั้นตอน

**เริ่มเซิร์ฟเวอร์:**
```bash
./start-servers.sh
```

**เปิดเว็บไซต์:**
```
http://localhost:8000
```

---

## 📋 คำสั่งที่มีให้ใช้

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `./open-website.sh` | เปิดเว็บพร้อมเช็คเซิร์ฟเวอร์ |
| `./start-servers.sh` | เริ่มเซิร์ฟเวอร์ทั้งหมด |
| `./stop-servers.sh` | หยุดเซิร์ฟเวอร์ทั้งหมด |
| `./restart-servers.sh` | Restart เซิร์ฟเวอร์ |
| `./check-servers.sh` | ตรวจสอบสถานะเซิร์ฟเวอร์ |

---

## 🌐 URL สำหรับเข้าใช้งาน

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:5001

---

## ✨ ฟีเจอร์หลัก

### 📱 จัดการสินค้า
- ✅ เครื่องใหม่ (New Devices)
- ✅ เครื่องมือสอง (Used Devices)
- ✅ อุปกรณ์เสริม (Accessories)
- ✅ อะไหล่ (Spare Parts)

### 🔧 บริการ
- ✅ ซ่อมเครื่อง (Repair Service)
- ✅ ผ่อนชำระ (Installment)
- ✅ จำนำ (Pawn)

### 📊 รายงาน
- ✅ Dashboard สรุปรายได้-รายจ่าย
- ✅ รายงานกำไร-ขาดทุน
- ✅ รายงานสต็อก

### 🏪 จัดการร้าน
- ✅ หลายสาขา (Multi-branch)
- ✅ จัดการพนักงาน
- ✅ Export Excel

---

## 🔧 ข้อกำหนดระบบ

- **Python:** 3.x
- **Node.js:** 14+
- **MySQL:** 8.0+
- **Browser:** Chrome, Safari, Firefox

---

## 📖 คู่มือการใช้งาน

### 📚 เอกสารที่มีให้

| ไฟล์ | คำอธิบาย |
|------|----------|
| `README.md` | คู่มือหลัก (ไฟล์นี้) |
| `README_SERVERS.md` | คู่มือจัดการเซิร์ฟเวอร์ |
| `OPEN_WEBSITE.md` | วิธีเปิดเว็บไซต์ |
| `TROUBLESHOOTING.md` | แก้ไขปัญหา |
| `QUICK_FIX.md` | แก้ไขด่วน |

### 🆘 เว็บเปิดไม่ขึ้น?

**อ่านคู่มือนี้:**
```bash
cat OPEN_WEBSITE.md
```

**หรือทำตามนี้:**
1. ตรวจสอบเซิร์ฟเวอร์: `./check-servers.sh`
2. Restart: `./restart-servers.sh`
3. เปิดเว็บ: `./open-website.sh`

---

## 💡 Tips & Tricks

### สร้าง Alias (ทางลัด)

เพิ่มในไฟล์ `~/.zshrc`:

```bash
# iLovePhone Store Shortcuts
alias ilove="cd /Users/chakkapong/Sites/ilovephone-store && ./open-website.sh"
alias ilove-start="cd /Users/chakkapong/Sites/ilovephone-store && ./start-servers.sh"
alias ilove-stop="cd /Users/chakkapong/Sites/ilovephone-store && ./stop-servers.sh"
alias ilove-restart="cd /Users/chakkapong/Sites/ilovephone-store && ./restart-servers.sh"
alias ilove-check="cd /Users/chakkapong/Sites/ilovephone-store && ./check-servers.sh"
```

จากนั้น:
```bash
source ~/.zshrc
```

ใช้งาน:
```bash
ilove          # เปิดเว็บ
ilove-start    # เริ่มเซิร์ฟเวอร์
ilove-check    # เช็คสถานะ
```

---

## 🔍 โครงสร้างโปรเจค

```
ilovephone-store/
├── index.html              # หน้าเว็บหลัก
├── script.js               # JavaScript หลัก
├── style.css               # CSS หลัก
├── server/                 # Backend
│   ├── server.js           # Express server
│   ├── routes/             # API routes
│   ├── config/             # Database config
│   └── .env                # Environment variables
├── open-website.sh         # ⭐ เปิดเว็บ
├── start-servers.sh        # เริ่มเซิร์ฟเวอร์
├── stop-servers.sh         # หยุดเซิร์ฟเวอร์
├── restart-servers.sh      # Restart
├── check-servers.sh        # เช็คสถานะ
└── README.md               # ไฟล์นี้
```

---

## 🐛 พบปัญหา?

### CORS Error
```
Access to fetch at 'http://localhost:8000' from origin 'null' 
has been blocked by CORS policy
```

**สาเหตุ:** เปิดไฟล์ผ่าน `file://` protocol

**แก้ไข:** เปิดผ่าน http:// แทน
```bash
./open-website.sh
# หรือ
open http://localhost:8000
```

### เซิร์ฟเวอร์ไม่ทำงาน

```bash
./restart-servers.sh
```

### เว็บแสดงข้อมูลเก่า

**Hard Refresh:**
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

---

## 📞 ติดต่อ & สนับสนุน

- 📧 ดูเอกสาร: `cat TROUBLESHOOTING.md`
- 🔧 ตรวจสอบสถานะ: `./check-servers.sh`
- 📊 ดู logs: `tail -f /tmp/backend-server.log`

---

## 📝 สิ่งที่อัปเดทล่าสุด

- ✅ ระบบจัดการอุปกรณ์ (Equipment Management)
- ✅ แยกประเภทชุดชาร์ต (Charger Sub-types)
- ✅ ปรับปรุง UI/UX
- ✅ เพิ่มสคริปต์จัดการเซิร์ฟเวอร์
- ✅ คู่มือการใช้งานแบบละเอียด

---

**📅 Last Updated:** 19 พ.ย. 2568  
**👨‍💻 Developer:** iLovePhone Store Team  
**🔖 Version:** 1.0.0

---

## 🎯 Quick Reference

```bash
# เริ่มใช้งาน
./open-website.sh

# ตรวจสอบ
./check-servers.sh

# Restart
./restart-servers.sh

# อ่านคู่มือ
cat OPEN_WEBSITE.md
```

---

**🚀 Happy Coding!**

