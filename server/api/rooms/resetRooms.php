<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();

    // Disable foreign key checks to safely truncate tables
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    // Truncate dependent tables first
    $pdo->exec("TRUNCATE TABLE bookings");      // Remove bookings referencing rooms/room_types
    $pdo->exec("TRUNCATE TABLE rooms");         // Remove all rooms
    $pdo->exec("TRUNCATE TABLE room_types");    // Remove all room types

    // Re-enable foreign key checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo json_encode([
        "success" => true,
        "message" => "Rooms, room_types, and related bookings reset successfully!"
    ]);
} catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
