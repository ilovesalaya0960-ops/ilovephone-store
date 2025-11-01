#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "  🔧 อัพเดทตาราง used_devices"
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

mysql -u $DB_USER $DB_NAME < server/migrations/update_used_devices_table.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration สำเร็จ!${NC}"
else
    echo ""
    echo -e "${RED}❌ Migration ล้มเหลว${NC}"
    exit 1
fi

# Verify columns
echo ""
echo "4. ตรวจสอบคอลัมน์ที่เพิ่ม..."
echo ""

purchased_from_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='used_devices' AND COLUMN_NAME='purchased_from'")
device_category_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='used_devices' AND COLUMN_NAME='device_category'")
device_condition_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='used_devices' AND COLUMN_NAME='device_condition'")

if [ "$purchased_from_exists" -eq "1" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'purchased_from' มีอยู่แล้ว${NC}"
else
    echo -e "   ${RED}❌ คอลัมน์ 'purchased_from' ยังไม่มี${NC}"
fi

if [ "$device_category_exists" -eq "1" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'device_category' มีอยู่แล้ว${NC}"
else
    echo -e "   ${RED}❌ คอลัมน์ 'device_category' ยังไม่มี${NC}"
fi

if [ "$device_condition_exists" -eq "1" ]; then
    echo -e "   ${GREEN}✅ คอลัมน์ 'device_condition' มีอยู่แล้ว${NC}"
else
    echo -e "   ${RED}❌ คอลัมน์ 'device_condition' ยังไม่มี${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "  📋 สรุปผลการอัพเดท"
echo "========================================="
echo ""

if [ "$purchased_from_exists" -eq "1" ] && [ "$device_category_exists" -eq "1" ] && [ "$device_condition_exists" -eq "1" ]; then
    echo -e "${GREEN}✅ ตาราง used_devices พร้อมใช้งาน!${NC}"
    echo ""
    echo "ขั้นตอนต่อไป:"
    echo "1. Restart Server (cd server && npm start)"
    echo "2. รีเฟรชเบราว์เซอร์"
    echo "3. ทดสอบเมนู 'เครื่องมือสอง'"
    echo "4. เปิด test-used-devices.html เพื่อทดสอบ"
else
    echo -e "${YELLOW}⚠️  ยังมีคอลัมน์ที่ไม่สมบูรณ์${NC}"
    echo ""
    echo "กรุณาตรวจสอบ error และลองรันอีกครั้ง"
fi

echo ""
echo "========================================="
echo ""

