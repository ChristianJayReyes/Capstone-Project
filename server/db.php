<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(['success' => true]);
    exit;
}

// Database configuration for AlwaysData
$DB_HOST = 'mysql-rosarioresortshotel.alwaysdata.net';
$DB_NAME = 'rosarioresortshotel_db';
$DB_USER = '423538';   
$DB_PASS = 'rosarioresorts';
$DB_CHARSET = 'utf8mb4';

function respond_json(int $statusCode, $payload): void {
    http_response_code($statusCode);
    echo is_string($payload) ? $payload : json_encode($payload);
    exit;
}

function get_pdo(): PDO {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_CHARSET;
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    try {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
        return $pdo;
    } catch (Throwable $e) {
        respond_json(500, [
            'success' => false,
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ]);
    }
}


// Create tables if they don't exist
function create_tables(): void {
    $pdo = get_pdo();
    
    $tables = [
        'users' => "
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                photo VARCHAR(500),
                reset_token VARCHAR(255),
                reset_expires TIMESTAMP NULL,
                verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                otp VARCHAR(6),
                otp_expires TIMESTAMP NULL,
                role ENUM('guest', 'admin') DEFAULT 'guest'
            )
        ",
        'room_types' => "
            CREATE TABLE IF NOT EXISTS room_types (
                room_type_id INT AUTO_INCREMENT PRIMARY KEY,
                type_name VARCHAR(100) NOT NULL,
                capacity_adults INT NOT NULL DEFAULT 1,
                capacity_children INT NOT NULL DEFAULT 0,
                price_per_night DECIMAL(10,2) NOT NULL
            )
        ",
        'rooms' => "
            CREATE TABLE IF NOT EXISTS rooms (
                room_id INT AUTO_INCREMENT PRIMARY KEY,
                room_number VARCHAR(20) UNIQUE NOT NULL,
                room_type_id INT NOT NULL,
                status ENUM('Available', 'Booked', 'Maintenance') DEFAULT 'Available',
                FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
            )
        ",
        'bookings' => "
            CREATE TABLE IF NOT EXISTS bookings (
                booking_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                room_type_id INT NOT NULL,
                check_in_date DATE NOT NULL,
                check_out_date DATE NOT NULL,
                status ENUM('Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_price DECIMAL(10,2) DEFAULT 0,
                check_in_time TIMESTAMP NULL,
                check_out_time TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
            )
        ",
        'booking_rooms' => "
            CREATE TABLE IF NOT EXISTS booking_rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id INT NOT NULL,
                room_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
                FOREIGN KEY (room_id) REFERENCES rooms(room_id)
            )
        ",
        'booking_logs' => "
            CREATE TABLE IF NOT EXISTS booking_logs (
                log_id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id INT NOT NULL,
                action VARCHAR(100) NOT NULL,
                admin_id INT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
                FOREIGN KEY (admin_id) REFERENCES users(user_id)
            )
        "
    ];
    
    foreach ($tables as $table => $sql) {
        try {
            $pdo->exec($sql);
        } catch (PDOException $e) {
            error_log("Error creating table $table: " . $e->getMessage());
        }
    }
}

// Initialize tables
create_tables();

?>