#!/bin/bash

echo "==================================="
echo "  🧪 ทดสอบการลบอุปกรณ์ (Equipment)"
echo "==================================="
echo ""

# สร้างอุปกรณ์ทดสอบ
echo "📦 [1/3] สร้างอุปกรณ์ทดสอบ..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST-EQ-DELETE-001",
    "type": "charger-set",
    "code": "TEST-DELETE-001",
    "brand": "Test Brand",
    "model": "Test Model",
    "sub_type": "usb-type-c",
    "quantity": 5,
    "cost_price": 100,
    "sale_price": 200,
    "import_date": "2025-11-20",
    "note": "ทดสอบการลบ - อุปกรณ์นี้สร้างเพื่อทดสอบการลบเท่านั้น",
    "store": "salaya"
  }')

echo "✅ สร้างเรียบร้อย: $CREATE_RESPONSE"
echo ""

# ตรวจสอบว่ามีข้อมูลอยู่จริง
echo "🔍 [2/3] ตรวจสอบข้อมูลใน Database..."
mysql -u root ilovephone_db -e "
SELECT id, code, brand, quantity, store 
FROM equipment 
WHERE id = 'TEST-EQ-DELETE-001';
" 2>/dev/null

echo ""
echo "⏳ รอ 2 วินาที..."
sleep 2
echo ""

# ลบอุปกรณ์
echo "🗑️  [3/3] ลบอุปกรณ์..."
DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:5001/api/equipment/TEST-EQ-DELETE-001)
echo "Response: $DELETE_RESPONSE"
echo ""

# ตรวจสอบว่าลบแล้วหรือยัง
echo "🔍 ตรวจสอบหลังลบ..."
REMAINING=$(mysql -u root ilovephone_db -se "
SELECT COUNT(*) 
FROM equipment 
WHERE id = 'TEST-EQ-DELETE-001';
" 2>/dev/null)

echo ""
if [ "$REMAINING" == "0" ]; then
    echo "✅ ✅ ✅ สำเร็จ! ข้อมูลถูกลบออกจาก Database แล้ว"
else
    echo "❌ ❌ ❌ ล้มเหลว! ยังมีข้อมูลอยู่ใน Database"
    echo "กำลังทำความสะอาด..."
    mysql -u root ilovephone_db -e "DELETE FROM equipment WHERE id = 'TEST-EQ-DELETE-001';" 2>/dev/null
fi

echo ""
echo "==================================="
echo "  🎉 การทดสอบเสร็จสิ้น"
echo "==================================="

