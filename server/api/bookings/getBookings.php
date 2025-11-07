<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();

    $sql = "
        SELECT 
            b.booking_id,
            u.full_name AS guest_name,
            u.email,
            rt.type_name AS room_type,
            b.room_number,
            b.check_in,
            b.check_out,
            CONCAT('Adult ', b.adults, ' | Child ', b.children) AS guests,
            b.total_price,
            b.payment_status,
            b.status AS booking_status,
            b.created_at
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN room_types rt ON b.room_type_id = rt.room_type_id
        ORDER BY b.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
