<?php
declare(strict_types=1);

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../helper.php';

$input = json_input();

$pdo = get_pdo();
$status = $input['status'] ?? 'Available';

try {
    // 1. Validate required fields
    if (empty($input['room_number'])) {
        respond_json(400, ['success' => false, 'message' => 'Room number is required']);
    }

    if (empty($input['room_type']) && empty($input['room_type_id'])) {
        respond_json(400, ['success' => false, 'message' => 'Room type is required']);
    }

    // 2. Handle room type
    $roomTypeId = null;

    if (!empty($input['room_type_id'])) {
        // Case: existing room type selected
        $roomTypeId = intval($input['room_type_id']);
        $stmt = $pdo->prepare("SELECT room_type_id FROM room_types WHERE room_type_id = ?");
        $stmt->execute([$roomTypeId]);
        if (!$stmt->fetch()) {
            respond_json(400, ['success' => false, 'message' => 'Invalid room_type_id provided']);
        }
    } else {
        // Case: new room type name provided
        $roomTypeName = sanitize_string($input['room_type']);

        // Check if it already exists
        $stmt = $pdo->prepare("SELECT room_type_id FROM room_types WHERE type_name = ?");
        $stmt->execute([$roomTypeName]);
        $roomType = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($roomType) {
            $roomTypeId = intval($roomType['room_type_id']);
        } else {
            // Insert a new room type
            $stmt = $pdo->prepare("
                INSERT INTO room_types (type_name, price_per_night, capacity_adults, capacity_children)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $roomTypeName,
                intval($input['price_per_night'] ?? 0),
                intval($input['capacity_adults'] ?? 0),
                intval($input['capacity_children'] ?? 0)
            ]);
            $roomTypeId = intval($pdo->lastInsertId());
        }
    }

    // 3. Insert the new room
    $stmt = $pdo->prepare("
        INSERT INTO rooms (room_number, room_type_id, status)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([
        sanitize_string($input['room_number']),
        $roomTypeId,
        ucfirst(strtolower($status))
    ]);

    respond_json(200, ['success' => true, 'message' => 'Room added successfully']);
} catch (PDOException $e) {
    respond_json(500, ['success' => false, 'message' => $e->getMessage()]);
}
