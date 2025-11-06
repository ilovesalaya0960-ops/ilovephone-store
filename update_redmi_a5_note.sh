#!/bin/bash

echo "=========================================="
echo "🔧 ลบหมายเหตุของ Redmi A5 (2244_T121264)"
echo "=========================================="
echo ""

# โหลด environment variables
if [ -f server/.env ]; then
    export $(cat server/.env | grep -v '^#' | xargs)
fi

# ตั้งค่า database defaults
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-ilovephone_db}
DB_PORT=${DB_PORT:-3306}

echo "🔍 ค้นหารายการ Redmi A5 (IMEI: 2244_T121264)..."
echo ""

# ค้นหาข้อมูลปัจจุบัน
if [ -z "$DB_PASSWORD" ]; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" << EOF
SELECT 
    '=== ข้อมูลปัจจุบัน ===' AS '';
    
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264'
UNION ALL
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';
EOF
else
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
SELECT 
    '=== ข้อมูลปัจจุบัน ===' AS '';
    
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264'
UNION ALL
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';
EOF
fi

echo ""
echo "=========================================="
read -p "ต้องการลบหมายเหตุนี้ออกหรือไม่? (y/n): " -n 1 -r
echo ""
echo "=========================================="

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 กำลังลบหมายเหตุ..."
    
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" << EOF
UPDATE used_devices SET note = '' WHERE imei = '2244_T121264';
UPDATE new_devices SET note = '' WHERE imei = '2244_T121264';
EOF
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
UPDATE used_devices SET note = '' WHERE imei = '2244_T121264';
UPDATE new_devices SET note = '' WHERE imei = '2244_T121264';
EOF
    fi
    
    echo "✅ ลบหมายเหตุเรียบร้อยแล้ว"
    echo ""
    echo "🔍 ตรวจสอบข้อมูลหลังอัพเดท..."
    echo ""
    
    # ตรวจสอบผลลัพธ์
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" << EOF
SELECT 
    '=== ข้อมูลหลังอัพเดท ===' AS '';
    
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264'
UNION ALL
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';
EOF
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
SELECT 
    '=== ข้อมูลหลังอัพเดท ===' AS '';
    
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM used_devices
WHERE imei = '2244_T121264'
UNION ALL
SELECT id, brand, model, color, imei, purchase_price, sale_price, 
       DATE_FORMAT(sale_date, '%d/%m/%Y') as sale_date, note, store
FROM new_devices
WHERE imei = '2244_T121264';
EOF
    fi
    
    echo ""
    echo "=========================================="
    echo "✅ เสร็จสิ้น!"
    echo "=========================================="
else
    echo ""
    echo "❌ ยกเลิกการลบหมายเหตุ"
fi

