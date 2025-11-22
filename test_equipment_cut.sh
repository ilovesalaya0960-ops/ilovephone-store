#!/bin/bash

echo "==========================================="
echo "  🧪 ทดสอบการตัดอุปกรณ์ (Cut Equipment)"
echo "==========================================="
echo ""

# สร้างอุปกรณ์ทดสอบ
echo "📦 [1/4] สร้างอุปกรณ์ทดสอบ..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST-EQ-CUT-001",
    "type": "charger-set",
    "code": "TEST-CUT-001",
    "brand": "Test Brand",
    "model": "Test Model",
    "sub_type": "usb-type-c",
    "quantity": 10,
    "cost_price": 100,
    "sale_price": 200,
    "import_date": "2025-11-20",
    "note": "ทดสอบการตัด",
    "store": "salaya"
  }')

echo "✅ สร้างเรียบร้อย: $CREATE_RESPONSE"
echo ""

# ตรวจสอบข้อมูลก่อนตัด
echo "🔍 [2/4] ตรวจสอบข้อมูลก่อนตัด..."
mysql -u root ilovephone_db -e "
SELECT id, code, brand, quantity, cut_quantity, cut_price, cut_date 
FROM equipment 
WHERE id = 'TEST-EQ-CUT-001';
" 2>/dev/null

echo ""
echo "⏳ รอ 2 วินาที..."
sleep 2
echo ""

# ตัดอุปกรณ์ 3 ชิ้น
echo "✂️  [3/4] ตัดอุปกรณ์ 3 ชิ้น ราคา 180 บาท/ชิ้น..."
CUT_RESPONSE=$(curl -s -X POST http://localhost:5001/api/equipment/TEST-EQ-CUT-001/cut \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3,
    "price": 180,
    "date": "2025-11-20",
    "note": "ทดสอบการตัดอุปกรณ์"
  }')

echo "Response: $CUT_RESPONSE"
echo ""

# ตรวจสอบหลังตัด
echo "🔍 [4/4] ตรวจสอบหลังตัด..."
mysql -u root ilovephone_db -e "
SELECT id, code, brand, quantity, cut_quantity, cut_price, cut_date 
FROM equipment 
WHERE id = 'TEST-EQ-CUT-001';
" 2>/dev/null

echo ""

# ตรวจสอบผลลัพธ์
QUANTITY=$(mysql -u root ilovephone_db -se "
SELECT quantity 
FROM equipment 
WHERE id = 'TEST-EQ-CUT-001';
" 2>/dev/null)

CUT_QUANTITY=$(mysql -u root ilovephone_db -se "
SELECT cut_quantity 
FROM equipment 
WHERE id = 'TEST-EQ-CUT-001';
" 2>/dev/null)

echo "📊 ผลการทดสอบ:"
if [ "$QUANTITY" == "7" ] && [ "$CUT_QUANTITY" == "3" ]; then
    echo "✅ ✅ ✅ สำเร็จ! quantity = 7 (10-3), cut_quantity = 3"
else
    echo "❌ ❌ ❌ ล้มเหลว! quantity = $QUANTITY (ควรเป็น 7), cut_quantity = $CUT_QUANTITY (ควรเป็น 3)"
fi

echo ""
echo "🧹 ทำความสะอาด..."
mysql -u root ilovephone_db -e "DELETE FROM equipment WHERE id = 'TEST-EQ-CUT-001';" 2>/dev/null
echo "✅ ลบข้อมูลทดสอบเรียบร้อย"

echo ""
echo "==========================================="
echo "  🎉 การทดสอบเสร็จสิ้น"
echo "==========================================="

