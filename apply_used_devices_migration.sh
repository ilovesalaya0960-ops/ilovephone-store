#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "  📱 อัพเดทระบบเครื่องมือสอง"
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

# Run migration
echo ""
echo "3. กำลังรัน migration..."
echo ""

mysql -u $DB_USER $DB_NAME < server/migrations/add_used_devices_new_fields.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration สำเร็จ!${NC}"
    echo ""
    
    # Show results
    echo "4. ตรวจสอบโครงสร้างตารางใหม่:"
    echo ""
    mysql -u $DB_USER $DB_NAME -e "
    SELECT 
        COLUMN_NAME as 'Column',
        COLUMN_TYPE as 'Type',
        COLUMN_DEFAULT as 'Default'
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='$DB_NAME' 
    AND TABLE_NAME='used_devices'
    AND COLUMN_NAME IN ('purchased_from', 'device_category', 'store', 'device_condition', 'import_date')
    ORDER BY ORDINAL_POSITION;
    "
    
    echo ""
    echo "========================================="
    echo "  ✅ อัพเดทเสร็จสมบูรณ์!"
    echo "========================================="
    echo ""
    echo "ฟิลด์ที่เพิ่มเข้ามา:"
    echo "  - purchased_from (ซื้อจาก)"
    echo "  - device_category (หมวดเครื่อง)"
    echo ""
    echo "ฟิลด์ที่แก้ไข:"
    echo "  - store_id → store"
    echo "  - condition_status → device_condition"
    echo "  - purchase_date → import_date"
    echo ""
    echo "ขั้นตอนต่อไป:"
    echo "1. Restart Server: cd server && npm start"
    echo "2. ทดสอบในเว็บ: เมนู 'เครื่องมือสอง'"
    echo "3. ตรวจสอบใน Sequel Ace"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Migration ล้มเหลว${NC}"
    echo ""
    echo "แนะนำ:"
    echo "1. ตรวจสอบว่ามี permission ในการแก้ไข database"
    echo "2. ตรวจสอบว่าไม่มี syntax error ใน SQL file"
    echo "3. ลองรันด้วยมือ:"
    echo "   mysql -u root -p $DB_NAME < server/migrations/add_used_devices_new_fields.sql"
    echo ""
    exit 1
fi

