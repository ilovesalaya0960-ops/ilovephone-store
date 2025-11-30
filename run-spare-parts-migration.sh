#!/bin/bash

echo "🔄 Running spare_parts migration..."
echo ""
echo "คำสั่งในการ run migration ใน MySQL:"
echo "mysql -u root -p ilovephone_db < server/migrations/create_spare_parts_table.sql"
echo ""
echo "หรือใน Sequel Ace:"
echo "1. เปิด Sequel Ace"
echo "2. เลือก database: ilovephone_db"
echo "3. คลิก 'Query' tab"
echo "4. วาง SQL จากไฟล์: server/migrations/create_spare_parts_table.sql"
echo "5. กด 'Run Selection' หรือ Cmd+R"
echo ""
