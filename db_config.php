<?php
/**
 * Database Configuration
 * Mobile Shop Management System
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mobile_shop_db');
define('DB_CHARSET', 'utf8mb4');

// Create connection
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database Connection Error: " . $e->getMessage());
        return null;
    }
}

// Test connection
function testConnection() {
    $conn = getDBConnection();
    if ($conn) {
        return [
            'success' => true,
            'message' => 'Database connection successful'
        ];
    } else {
        return [
            'success' => false,
            'message' => 'Database connection failed'
        ];
    }
}

// Enable CORS for API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>

