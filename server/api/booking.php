<?php
header("Content-Type: application/json");
include "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'];
    $room_type_id = $data['room_type_id'];
    $check_in = $data['check_in_date'];
    $check_out = $data['check_out_date'];

    // Get price from room_types
    $sql = "SELECT price_per_night FROM room_types WHERE room_type_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $room_type_id);
    $stmt->execute();
    $roomType = $stmt->get_result()->fetch_assoc();

    if (!$roomType) {
        echo json_encode(["success" => false, "message" => "Room type not found"]);
        exit;
    }

    $pricePerNight = $roomType['price_per_night'];

    // Calculate nights
    $checkInDate = new DateTime($check_in);
    $checkOutDate = new DateTime($check_out);
    $nights = $checkOutDate->diff($checkInDate)->days;
    $totalPrice = $pricePerNight * $nights;

    // Insert into bookings
    $sql = "INSERT INTO bookings (user_id, room_type_id, check_in_date, check_out_date, status, total_price, created_at)
            VALUES (?, ?, ?, ?, 'pending', ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissd", $user_id, $room_type_id, $check_in, $check_out, $totalPrice);
    $stmt->execute();
    $bookingId = $stmt->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Booking created successfully",
        "booking_id" => $bookingId,
        "total_price" => $totalPrice
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);
    $sql = "SELECT b.*, rt.type_name 
            FROM bookings b
            JOIN room_types rt ON b.room_type_id = rt.room_type_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }

    echo json_encode([
        "success" => true,
        "bookings" => $bookings
    ]);
}

?>
