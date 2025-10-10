<?php
declare(strict_types=1);
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();
    
    // Build WHERE clause based on filters
    $where = [];
    $params = [];
    
    // Search filter
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = sanitize_string($_GET['search']);
        $where[] = "(u.full_name LIKE :search OR rt.type_name LIKE :search)";
        $params[':search'] = "%{$search}%";
    }
    
    // Status filter
    if (isset($_GET['status']) && $_GET['status'] !== 'all') {
        $status = sanitize_string($_GET['status']);
        $where[] = "b.status = :status";
        $params[':status'] = $status;
    }
    
    // Room type filter
    if (isset($_GET['room_type']) && $_GET['room_type'] !== 'all') {
        $roomType = sanitize_string($_GET['room_type']);
        $where[] = "rt.type_name = :room_type";
        $params[':room_type'] = $roomType;
    }
    
    // Check-in date filter
    if (isset($_GET['check_in_date']) && !empty($_GET['check_in_date'])) {
        $where[] = "b.check_in_date = :check_in_date";
        $params[':check_in_date'] = $_GET['check_in_date'];
    }
    
    // Check-out date filter
    if (isset($_GET['check_out_date']) && !empty($_GET['check_out_date'])) {
        $where[] = "b.check_out_date = :check_out_date";
        $params[':check_out_date'] = $_GET['check_out_date'];
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "SELECT 
    b.booking_id,
    b.user_id,
    u.full_name,
    u.email,
    u.phone,
    rt.room_type_id,
    rt.type_name AS roomType,
    b.total_price,
    b.status,
    b.created_at,
    b.check_in,
    b.check_out,
    br.room_id,
    r.room_number
FROM bookings b
JOIN users u ON u.user_id = b.user_id
JOIN room_types rt ON rt.room_type_id = b.room_type_id
LEFT JOIN booking_rooms br ON br.booking_id = b.booking_id
LEFT JOIN rooms r ON r.room_id = br.room_id
{$whereClause}
ORDER BY b.created_at DESC";

    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll();
    
    respond_json(200, [
        'success' => true,
        'data' => $bookings
    ]);
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch bookings',
        'error' => $e->getMessage()
    ]);
}

?>
