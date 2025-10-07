#!/bin/bash

# ===================================
# Mobile Shop Database Installation
# ===================================

echo "=================================="
echo "ติดตั้งฐานข้อมูล Mobile Shop"
echo "=================================="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ ไม่พบ MySQL"
    echo "กรุณาติดตั้ง MySQL หรือ XAMPP/MAMP ก่อน"
    exit 1
fi

echo "✅ พบ MySQL"
echo ""

# Get MySQL credentials
read -p "MySQL Username [root]: " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -sp "MySQL Password (กด Enter ถ้าไม่มีรหัสผ่าน): " MYSQL_PASS
echo ""
echo ""

# Test connection
echo "🔍 ทดสอบการเชื่อมต่อ..."
if [ -z "$MYSQL_PASS" ]; then
    mysql -u"$MYSQL_USER" -e "SELECT 1;" &> /dev/null
else
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -e "SELECT 1;" &> /dev/null
fi

if [ $? -ne 0 ]; then
    echo "❌ การเชื่อมต่อล้มเหลว"
    echo "กรุณาตรวจสอบ Username และ Password"
    exit 1
fi

echo "✅ การเชื่อมต่อสำเร็จ"
echo ""

# Import database
echo "📦 กำลังติดตั้งฐานข้อมูล..."
if [ -z "$MYSQL_PASS" ]; then
    mysql -u"$MYSQL_USER" < database.sql
else
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" < database.sql
fi

if [ $? -eq 0 ]; then
    echo "✅ ติดตั้งฐานข้อมูลสำเร็จ!"
    echo ""
    echo "=================================="
    echo "ข้อมูลการเชื่อมต่อ:"
    echo "=================================="
    echo "Database: mobile_shop_db"
    echo "Username: $MYSQL_USER"
    echo "Host: localhost"
    echo ""
    echo "📝 กรุณาแก้ไขไฟล์ db_config.php"
    echo "   ให้ตรงกับข้อมูลด้านบน"
    echo ""
    echo "✨ ติดตั้งเสร็จสมบูรณ์!"
else
    echo "❌ เกิดข้อผิดพลาดในการติดตั้ง"
    exit 1
fi
