<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ทดสอบการเชื่อมต่อฐานข้อมูล</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 28px;
        }
        
        .status-box {
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 16px;
        }
        
        .success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .info-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .info-box h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #666;
        }
        
        .info-value {
            color: #333;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
        }
        
        .btn:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .icon {
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 ทดสอบการเชื่อมต่อฐานข้อมูล</h1>
        
        <?php
        require_once 'db_config.php';
        
        $conn = getDBConnection();
        
        if ($conn) {
            echo '<div class="icon">✅</div>';
            echo '<div class="status-box success">';
            echo '<strong>การเชื่อมต่อสำเร็จ!</strong><br>';
            echo 'เชื่อมต่อกับฐานข้อมูล MySQL สำเร็จ';
            echo '</div>';
            
            // Get database info
            $stmt = $conn->query("SELECT VERSION() as version");
            $version = $stmt->fetch();
            
            $stmt = $conn->query("SELECT DATABASE() as dbname");
            $dbname = $stmt->fetch();
            
            $stmt = $conn->query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE()");
            $tableCount = $stmt->fetch();
            
            echo '<div class="info-box">';
            echo '<h3>ข้อมูลฐานข้อมูล</h3>';
            
            echo '<div class="info-row">';
            echo '<span class="info-label">MySQL Version:</span>';
            echo '<span class="info-value">' . $version['version'] . '</span>';
            echo '</div>';
            
            echo '<div class="info-row">';
            echo '<span class="info-label">ชื่อฐานข้อมูล:</span>';
            echo '<span class="info-value">' . $dbname['dbname'] . '</span>';
            echo '</div>';
            
            echo '<div class="info-row">';
            echo '<span class="info-label">Host:</span>';
            echo '<span class="info-value">' . DB_HOST . '</span>';
            echo '</div>';
            
            echo '<div class="info-row">';
            echo '<span class="info-label">จำนวนตาราง:</span>';
            echo '<span class="info-value">' . $tableCount['count'] . ' ตาราง</span>';
            echo '</div>';
            
            echo '<div class="info-row">';
            echo '<span class="info-label">Character Set:</span>';
            echo '<span class="info-value">' . DB_CHARSET . '</span>';
            echo '</div>';
            
            echo '</div>';
            
            // List all tables
            $stmt = $conn->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (!empty($tables)) {
                echo '<div class="info-box">';
                echo '<h3>ตารางในฐานข้อมูล (' . count($tables) . ')</h3>';
                foreach ($tables as $table) {
                    // Get row count
                    $stmt = $conn->query("SELECT COUNT(*) as count FROM `$table`");
                    $count = $stmt->fetch();
                    
                    echo '<div class="info-row">';
                    echo '<span class="info-label">' . $table . '</span>';
                    echo '<span class="info-value">' . number_format($count['count']) . ' แถว</span>';
                    echo '</div>';
                }
                echo '</div>';
            }
            
        } else {
            echo '<div class="icon">❌</div>';
            echo '<div class="status-box error">';
            echo '<strong>การเชื่อมต่อล้มเหลว!</strong><br>';
            echo 'ไม่สามารถเชื่อมต่อกับฐานข้อมูล MySQL ได้<br><br>';
            echo '<strong>กรุณาตรวจสอบ:</strong><br>';
            echo '1. MySQL Server ทำงานอยู่หรือไม่<br>';
            echo '2. Username และ Password ถูกต้องหรือไม่<br>';
            echo '3. ชื่อฐานข้อมูลถูกต้องหรือไม่<br>';
            echo '4. ตั้งค่าใน db_config.php ถูกต้องหรือไม่';
            echo '</div>';
            
            echo '<div class="info-box">';
            echo '<h3>การตั้งค่าปัจจุบัน</h3>';
            echo '<div class="info-row">';
            echo '<span class="info-label">Host:</span>';
            echo '<span class="info-value">' . DB_HOST . '</span>';
            echo '</div>';
            echo '<div class="info-row">';
            echo '<span class="info-label">Database:</span>';
            echo '<span class="info-value">' . DB_NAME . '</span>';
            echo '</div>';
            echo '<div class="info-row">';
            echo '<span class="info-label">User:</span>';
            echo '<span class="info-value">' . DB_USER . '</span>';
            echo '</div>';
            echo '</div>';
        }
        ?>
        
        <a href="index.html" class="btn">← กลับหน้าหลัก</a>
    </div>
</body>
</html>

