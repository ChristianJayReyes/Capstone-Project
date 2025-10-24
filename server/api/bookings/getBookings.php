<<<<<<< HEAD
<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();

    $sql = "SELECT 
                b.booking_id,
                u.full_name AS guest_name,
                rt.type_name AS room_type,
                b.check_in,
                b.check_out,
                b.status,
                b.payment_status,
                b.total_price,
                GROUP_CONCAT(r.room_number SEPARATOR ', ') AS room_numbers
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN room_types rt ON b.room_type_id = rt.room_type_id
            LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
            LEFT JOIN rooms r ON br.room_id = r.room_id
            GROUP BY b.booking_id
            ORDER BY b.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    respond_json(200, ['success' => true, 'data' => $bookings]);
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch bookings',
        'error' => $e->getMessage()
    ]);
}
?>
=======
<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();

    $sql = "SELECT 
                b.booking_id,
                u.full_name AS guest_name,
                rt.type_name AS room_type,
                b.check_in,
                b.check_out,
                b.status,
                b.payment_status,
                b.total_price,
                GROUP_CONCAT(r.room_number SEPARATOR ', ') AS room_numbers
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN room_types rt ON b.room_type_id = rt.room_type_id
            LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
            LEFT JOIN rooms r ON br.room_id = r.room_id
            GROUP BY b.booking_id
            ORDER BY b.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    respond_json(200, ['success' => true, 'data' => $bookings]);
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch bookings',
        'error' => $e->getMessage()
    ]);
}
?>
>>>>>>> b84fe5c (updated backend/reservation/admin-side)
