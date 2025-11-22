#!/bin/bash

echo "=================================================="
echo "  🧪 ทดสอบการย้ายอุปกรณ์ระหว่างร้าน"
echo "=================================================="
echo ""

# สร้างอุปกรณ์ทดสอบที่ร้านศาลายา
echo "📦 [1/5] สร้างอุปกรณ์ทดสอบที่ร้านศาลายา..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST-EQ-TRANSFER-001",
    "type": "charger-set",
    "code": "TEST-TRANS-001",
    "brand": "Test Brand",
    "model": "Test Model",
    "sub_type": "usb-type-c",
    "quantity": 20,
    "cost_price": 100,
    "sale_price": 200,
    "import_date": "2025-11-20",
    "note": "ทดสอบการย้ายร้าน",
    "store": "salaya"
  }')

echo "✅ สร้างเรียบร้อย: $CREATE_RESPONSE"
echo ""

# ตรวจสอบข้อมูลก่อนย้าย
echo "🔍 [2/5] ตรวจสอบข้อมูลก่อนย้าย..."
echo "📊 ร้านศาลายา:"
mysql -u root ilovephone_db -e "
SELECT id, code, brand, store, quantity 
FROM equipment 
WHERE code = 'TEST-TRANS-001';
" 2>/dev/null

echo ""
echo "⏳ รอ 2 วินาที..."
sleep 2
echo ""

# ลดจำนวนที่ร้านศาลายา (ย้าย 5 ชิ้น)
echo "📉 [3/5] ลดจำนวนที่ร้านศาลายา (ย้าย 5 ชิ้น ไปคลองโยง)..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5001/api/equipment/TEST-EQ-TRANSFER-001 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "charger-set",
    "code": "TEST-TRANS-001",
    "brand": "Test Brand",
    "model": "Test Model",
    "sub_type": "usb-type-c",
    "quantity": 15,
    "cost_price": 100,
    "sale_price": 200,
    "import_date": "2025-11-20",
    "cut_quantity": 0,
    "cut_price": null,
    "cut_date": null,
    "note": "ทดสอบการย้ายร้าน\nย้ายไป ร้านคลองโยง 2025-11-20: 5 ชิ้น",
    "store": "salaya"
  }')

echo "Response: $UPDATE_RESPONSE"
echo ""

# สร้างอุปกรณ์ใหม่ที่ร้านคลองโยง
echo "➕ [4/5] สร้างอุปกรณ์ที่ร้านคลองโยง (5 ชิ้น)..."
CREATE_TARGET_RESPONSE=$(curl -s -X POST http://localhost:5001/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST-EQ-TRANSFER-002",
    "type": "charger-set",
    "code": "TEST-TRANS-001",
    "brand": "Test Brand",
    "model": "Test Model",
    "sub_type": "usb-type-c",
    "quantity": 5,
    "cost_price": 100,
    "sale_price": 200,
    "import_date": "2025-11-20",
    "note": "ย้ายมาจากร้าน ศาลายา 2025-11-20: 5 ชิ้น",
    "store": "klongyong"
  }')

echo "Response: $CREATE_TARGET_RESPONSE"
echo ""

# ตรวจสอบหลังย้าย
echo "🔍 [5/5] ตรวจสอบหลังย้าย..."
echo "📊 ทั้ง 2 ร้าน:"
mysql -u root ilovephone_db -e "
SELECT id, code, brand, store, quantity, note 
FROM equipment 
WHERE code = 'TEST-TRANS-001'
ORDER BY store;
" 2>/dev/null

echo ""

# ตรวจสอบผลลัพธ์
SALAYA_QTY=$(mysql -u root ilovephone_db -se "
SELECT quantity 
FROM equipment 
WHERE code = 'TEST-TRANS-001' AND store = 'salaya';
" 2>/dev/null)

KLONGYONG_QTY=$(mysql -u root ilovephone_db -se "
SELECT quantity 
FROM equipment 
WHERE code = 'TEST-TRANS-001' AND store = 'klongyong';
" 2>/dev/null)

echo "📊 ผลการทดสอบ:"
if [ "$SALAYA_QTY" == "15" ] && [ "$KLONGYONG_QTY" == "5" ]; then
    echo "✅ ✅ ✅ สำเร็จ!"
    echo "   ศาลายา: $SALAYA_QTY ชิ้น (ลดจาก 20 เหลือ 15)"
    echo "   คลองโยง: $KLONGYONG_QTY ชิ้น (เพิ่ม 5 ชิ้นใหม่)"
else
    echo "❌ ❌ ❌ ล้มเหลว!"
    echo "   ศาลายา: $SALAYA_QTY ชิ้น (ควรเป็น 15)"
    echo "   คลองโยง: $KLONGYONG_QTY ชิ้น (ควรเป็น 5)"
fi

echo ""
echo "🧹 ทำความสะอาด..."
mysql -u root ilovephone_db -e "
DELETE FROM equipment WHERE code = 'TEST-TRANS-001';
" 2>/dev/null
echo "✅ ลบข้อมูลทดสอบเรียบร้อย"

echo ""
echo "=================================================="
echo "  🎉 การทดสอบเสร็จสิ้น"
echo "=================================================="

