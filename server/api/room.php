<?php
header("Content-Type: application/json");
include "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT r.room_id, r.room_number, rt.type_name, rt.capacity_adults, 
                   rt.capacity_children, rt.price_per_night, r.status
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
            WHERE r.status = 'available'";
    $result = $conn->query($sql);

    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }

    echo json_encode([
        "success" => true,
        "rooms" => $rooms
    ]);
}
?>