<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();
    $room_type_id = $_GET['room_type_id'] ?? null;

    $sql = "SELECT r.room_id, r.room_number, rt.type_name, rt.price_per_night, rt.capacity_adults, rt.capacity_children, r.status
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
            WHERE r.status = 'Available'";

    if ($room_type_id) {
        $sql .= " AND r.room_type_id = :room_type_id";
    }

    $stmt = $pdo->prepare($sql);
    if ($room_type_id) $stmt->bindParam(':room_type_id', $room_type_id, PDO::PARAM_INT);
    $stmt->execute();
    $rooms = $stmt->fetchAll();

    respond_json(200, ['success' => true, 'data' => $rooms]);

} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch available rooms',
        'error' => $e->getMessage()
    ]);
}
?>
