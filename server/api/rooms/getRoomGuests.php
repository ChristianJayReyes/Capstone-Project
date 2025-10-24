<<<<<<< HEAD
<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';


try {
    $pdo = get_pdo();
    $roomId = (int) basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

    
    if ($roomId <= 0) {
        respond_json(400, ['success' => false, 'message' => 'room_id is required']);
    }
    
    $sql = "SELECT 
        b.booking_id,
        u.user_id as guest_id,
        u.full_name as guest_name,
        u.email,
        u.phone,
        b.check_in_date,
        b.check_out_date,
        b.status,
        rt.type_name as room_type,
        b.check_in_time,
        b.check_out_time
    FROM bookings b
    JOIN users u ON u.user_id = b.user_id
    JOIN room_types rt ON rt.room_type_id = b.room_type_id
    JOIN booking_rooms br ON br.booking_id = b.booking_id
    WHERE br.room_id = :room_id AND b.status IN ('Confirmed','Checked-in')
    ORDER BY b.check_in_date DESC LIMIT 1";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':room_id' => $roomId]);
    $data = $stmt->fetch();
    
    if (!$data) {
        respond_json(200, ['success' => true, 'data' => null]);
    }
    
    respond_json(200, ['success' => true, 'data' => $data]);
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch room guest',
        'error' => $e->getMessage()
    ]);
}


=======
<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helper.php';


try {
    $pdo = get_pdo();
    $roomId = (int) basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

    
    if ($roomId <= 0) {
        respond_json(400, ['success' => false, 'message' => 'room_id is required']);
    }
    
    $sql = "SELECT 
        b.booking_id,
        u.user_id as guest_id,
        u.full_name as guest_name,
        u.email,
        u.phone,
        b.check_in_date,
        b.check_out_date,
        b.status,
        rt.type_name as room_type,
        b.check_in_time,
        b.check_out_time
    FROM bookings b
    JOIN users u ON u.user_id = b.user_id
    JOIN room_types rt ON rt.room_type_id = b.room_type_id
    JOIN booking_rooms br ON br.booking_id = b.booking_id
    WHERE br.room_id = :room_id AND b.status IN ('Confirmed','Checked-in')
    ORDER BY b.check_in_date DESC LIMIT 1";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':room_id' => $roomId]);
    $data = $stmt->fetch();
    
    if (!$data) {
        respond_json(200, ['success' => true, 'data' => null]);
    }
    
    respond_json(200, ['success' => true, 'data' => $data]);
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch room guest',
        'error' => $e->getMessage()
    ]);
}


>>>>>>> b84fe5c (updated backend/reservation/admin-side)
