#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "  🔍 ระบบตรวจสอบฟิลด์ใหม่"
echo "========================================="
echo ""

# Database credentials
DB_NAME="mobile_shop_db"
DB_USER="root"

# Check MySQL connection
echo -n "1. ตรวจสอบการเชื่อมต่อ MySQL... "
if mysql -u $DB_USER -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ เชื่อมต่อสำเร็จ${NC}"
else
    echo -e "${RED}❌ เชื่อมต่อไม่ได้${NC}"
    echo "   กรุณาเปิด MySQL ก่อน"
    exit 1
fi

# Check database exists
echo -n "2. ตรวจสอบฐานข้อมูล... "
if mysql -u $DB_USER -e "USE $DB_NAME; SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ พบฐานข้อมูล $DB_NAME${NC}"
else
    echo -e "${RED}❌ ไม่พบฐานข้อมูล $DB_NAME${NC}"
    exit 1
fi

# Check columns
echo ""
echo "3. ตรวจสอบคอลัมน์ในตาราง new_devices..."

purchased_from_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='new_devices' AND COLUMN_NAME='purchased_from'")
device_category_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='new_devices' AND COLUMN_NAME='device_category'")

if [ "$purchased_from_exists" -eq "1" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'purchased_from' มีอยู่แล้ว${NC}"
else
    echo -e "   ${RED}❌ คอลัมน์ 'purchased_from' ยังไม่มี${NC}"
    echo -e "   ${YELLOW}   กำลังเพิ่มคอลัมน์...${NC}"
    mysql -u $DB_USER $DB_NAME -e "ALTER TABLE new_devices ADD COLUMN purchased_from VARCHAR(100) AFTER rom;"
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ เพิ่มคอลัมน์ 'purchased_from' สำเร็จ${NC}"
    else
        echo -e "   ${RED}❌ เพิ่มคอลัมน์ไม่สำเร็จ${NC}"
    fi
fi

if [ "$device_category_exists" -eq "1" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'device_category' มีอยู่แล้ว${NC}"
else
    echo -e "   ${RED}❌ คอลัมน์ 'device_category' ยังไม่มี${NC}"
    echo -e "   ${YELLOW}   กำลังเพิ่มคอลัมน์...${NC}"
    mysql -u $DB_USER $DB_NAME -e "ALTER TABLE new_devices ADD COLUMN device_category ENUM('No Active', 'Active') DEFAULT 'No Active' AFTER purchased_from;"
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ เพิ่มคอลัมน์ 'device_category' สำเร็จ${NC}"
        mysql -u $DB_USER $DB_NAME -e "UPDATE new_devices SET device_category = 'No Active' WHERE device_category IS NULL;"
    else
        echo -e "   ${RED}❌ เพิ่มคอลัมน์ไม่สำเร็จ${NC}"
    fi
fi

# Check store column name
echo ""
echo "4. ตรวจสอบชื่อคอลัมน์ store..."
store_column=$(mysql -u $DB_USER $DB_NAME -se "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='new_devices' AND COLUMN_NAME IN ('store', 'store_id') LIMIT 1")

if [ "$store_column" == "store_id" ]; then
    echo -e "   ${YELLOW}⚠️  ฐานข้อมูลใช้ 'store_id' แต่โค้ดใช้ 'store'${NC}"
    echo -e "   ${YELLOW}   ต้องแก้ไขให้ตรงกัน${NC}"
    echo ""
    echo "   ต้องการเปลี่ยนชื่อคอลัมน์ 'store_id' เป็น 'store' หรือไม่? (y/n)"
    read -r answer
    if [ "$answer" == "y" ]; then
        mysql -u $DB_USER $DB_NAME -e "ALTER TABLE new_devices CHANGE store_id store VARCHAR(50) NOT NULL;"
        echo -e "   ${GREEN}✅ เปลี่ยนชื่อคอลัมน์สำเร็จ${NC}"
    fi
elif [ "$store_column" == "store" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'store' ถูกต้อง${NC}"
else
    echo -e "   ${RED}❌ ไม่พบคอลัมน์ store หรือ store_id${NC}"
fi

# Display table structure
echo ""
echo "5. โครงสร้างตารางปัจจุบัน:"
echo ""
mysql -u $DB_USER $DB_NAME -e "
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='new_devices'
AND COLUMN_NAME IN ('ram', 'rom', 'purchased_from', 'device_category', 'store', 'store_id')
ORDER BY ORDINAL_POSITION;
"

# Check sample data
echo ""
echo "6. ข้อมูลตัวอย่าง (5 รายการแรก):"
echo ""
mysql -u $DB_USER $DB_NAME -e "
SELECT 
    id,
    brand,
    model,
    IFNULL(purchased_from, '(null)') as purchased_from,
    IFNULL(device_category, '(null)') as device_category
FROM new_devices
ORDER BY created_at DESC
LIMIT 5;
"

# Check server
echo ""
echo -n "7. ตรวจสอบ API Server... "
if curl -s http://localhost:3000/api/newDevices?store=salaya > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server ทำงานปกติ${NC}"
    
    # Check API response
    echo ""
    echo "8. ตรวจสอบ API Response (เครื่องแรก):"
    echo ""
    response=$(curl -s http://localhost:3000/api/newDevices?store=salaya | python3 -m json.tool 2>/dev/null | head -30)
    if [ ! -z "$response" ]; then
        echo "$response"
    else
        echo -e "${YELLOW}   ⚠️  ไม่มีข้อมูล หรือ format ไม่ถูกต้อง${NC}"
    fi
else
    echo -e "${RED}❌ Server ไม่ตอบสนอง${NC}"
    echo "   กรุณารัน: cd server && npm start"
fi

# Summary
echo ""
echo "========================================="
echo "  📋 สรุปผลการตรวจสอบ"
echo "========================================="
echo ""

if [ "$purchased_from_exists" -eq "1" ] && [ "$device_category_exists" -eq "1" ]; then
    echo -e "${GREEN}✅ ฟิลด์ทั้งสองมีในฐานข้อมูลแล้ว${NC}"
    echo ""
    echo "ขั้นตอนต่อไป:"
    echo "1. Restart Server (ถ้ารันอยู่)"
    echo "2. รีเฟรชเบราว์เซอร์ (Ctrl+Shift+R)"
    echo "3. ลองเพิ่มและแก้ไขเครื่องใหม่"
    echo "4. เปิด test-new-device-fields.html เพื่อทดสอบ API"
else
    echo -e "${YELLOW}⚠️  ยังมีฟิลด์ที่ไม่สมบูรณ์${NC}"
    echo ""
    echo "กรุณารันคำสั่ง:"
    echo "mysql -u root -p $DB_NAME < fix_missing_fields.sql"
fi

echo ""
echo "========================================="
echo ""

