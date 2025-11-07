#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "  🔧 อัพเดทตาราง repairs"
echo "========================================="
echo ""

# Database credentials - ตรวจสอบจาก config
# Default: ilovephone_db (จาก database.js)
# หรือ mobile_shop_db (จาก migration scripts อื่นๆ)
DB_NAME=${1:-ilovephone_db}
DB_USER=${2:-root}

echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Check MySQL connection
echo -n "1. ตรวจสอบการเชื่อมต่อ MySQL... "
if mysql -u $DB_USER -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ เชื่อมต่อสำเร็จ${NC}"
else
    echo -e "${RED}❌ เชื่อมต่อไม่ได้${NC}"
    echo "   กรุณาเปิด MySQL ก่อน"
    echo ""
    echo "   ถ้าใช้ MAMP: เปิด MAMP → กด 'Start Servers'"
    echo "   ถ้าใช้ Homebrew: brew services start mysql"
    exit 1
fi

# Check database exists
echo -n "2. ตรวจสอบฐานข้อมูล... "
if mysql -u $DB_USER -e "USE $DB_NAME; SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ พบฐานข้อมูล $DB_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  ไม่พบฐานข้อมูล $DB_NAME${NC}"
    echo ""
    echo "   กำลังลองใช้ mobile_shop_db..."
    DB_NAME="mobile_shop_db"
    if mysql -u $DB_USER -e "USE $DB_NAME; SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✅ พบฐานข้อมูล $DB_NAME${NC}"
    else
        echo -e "${RED}❌ ไม่พบฐานข้อมูลทั้งสอง${NC}"
        echo ""
        echo "   กรุณาระบุ database name:"
        echo "   ./fix_repairs_migration.sh [database_name] [user]"
        echo ""
        echo "   ตัวอย่าง:"
        echo "   ./fix_repairs_migration.sh ilovephone_db root"
        exit 1
    fi
fi

# Run migration
echo ""
echo "3. กำลังรัน migration..."
echo ""

mysql -u $DB_USER $DB_NAME < server/migrations/fix_repairs_schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration สำเร็จ!${NC}"
    echo ""
    
    # Verify table exists
    echo "4. ตรวจสอบตาราง repairs..."
    echo ""
    
    table_exists=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='repairs'")
    
    if [ "$table_exists" -eq 1 ]; then
        echo -e "${GREEN}✅ ตาราง repairs มีอยู่แล้ว${NC}"
        echo ""
        
        # Show columns
        echo "5. ตรวจสอบคอลัมน์ที่สำคัญ:"
        echo ""
        mysql -u $DB_USER $DB_NAME -e "
        SELECT 
            COLUMN_NAME as 'Column',
            COLUMN_TYPE as 'Type',
            IS_NULLABLE as 'Nullable',
            COLUMN_DEFAULT as 'Default'
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA='$DB_NAME' 
        AND TABLE_NAME='repairs'
        AND COLUMN_NAME IN ('id', 'store', 'problem', 'received_date', 'returned_date', 'seized_date', 'appointment_date', 'customer_name', 'customer_phone', 'status')
        ORDER BY ORDINAL_POSITION;
        "
        
        echo ""
        echo "6. ตรวจสอบข้อมูลตัวอย่าง:"
        echo ""
        count=$(mysql -u $DB_USER $DB_NAME -se "SELECT COUNT(*) FROM repairs")
        echo "   จำนวนรายการในตาราง: $count"
        
        if [ "$count" -gt 0 ]; then
            echo ""
            echo "   ตัวอย่างข้อมูล:"
            mysql -u $DB_USER $DB_NAME -e "SELECT id, store, brand, model, problem, received_date, status FROM repairs LIMIT 3;"
        fi
        
        echo ""
        echo "========================================="
        echo -e "  ${GREEN}✅ Migration เสร็จสมบูรณ์!${NC}"
        echo "========================================="
        echo ""
        echo "สิ่งที่ทำ:"
        echo "  ✅ สร้างตาราง repairs (ถ้ายังไม่มี)"
        echo "  ✅ เพิ่ม columns: store, problem, received_date, returned_date, seized_date, appointment_date"
        echo "  ✅ แก้ไข customer_name และ customer_phone เป็น nullable"
        echo "  ✅ เพิ่ม 'seized' ใน status enum"
        echo ""
        echo "ขั้นตอนต่อไป:"
        echo "1. Restart Server (ถ้า server กำลังรันอยู่)"
        echo "2. Refresh หน้าเว็บ (Cmd+Shift+R)"
        echo "3. ทดสอบเพิ่มรายการซ่อมใหม่"
        echo ""
    else
        echo -e "${RED}❌ ตาราง repairs ไม่พบ${NC}"
        echo ""
        echo "   กรุณาตรวจสอบ error messages ด้านบน"
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Migration ล้มเหลว${NC}"
    echo ""
    echo "แนะนำ:"
    echo "1. ตรวจสอบ error messages ด้านบน"
    echo "2. ตรวจสอบว่า MySQL มี permission ในการแก้ไข database"
    echo "3. ลองรันด้วยมือ:"
    echo "   mysql -u $DB_USER -p $DB_NAME < server/migrations/fix_repairs_schema.sql"
    echo ""
    exit 1
fi

