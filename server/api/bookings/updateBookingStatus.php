<<<<<<< HEAD
<?php
require_once __DIR__ . '/../../db.php'; // ✅ Correct path to db.php

header('Content-Type: application/json');

$raw = file_get_contents("php://input");
if (empty($raw)) {
    echo json_encode(["success" => false, "message" => "No JSON body received"]);
    exit;
}

$data = json_decode($raw, true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON format", "raw_input" => $raw]);
    exit;
}

$booking_id = $data['booking_id'] ?? null;
$action = $data['action'] ?? null;
$room_id = $data['room_id'] ?? null;
$payment_status = $data['payment_status'] ?? null;

if (!$booking_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing booking_id or action"]);
    exit;
}

// ✅ Define the correct next status depending on action
$statusMap = [
    'assign_room' => 'Confirmed',
    'confirm' => 'Confirmed',
    'checkin' => 'Checked-in',
    'checkout' => 'Checked-out',
    'cancel' => 'Cancelled'
];

$newStatus = $statusMap[$action] ?? null;
if (!$newStatus) {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

try {
    $pdo = get_pdo(); // ✅ use PDO instance from db.php

    // ✅ If assigning a room
    if ($action === 'assign_room' && $room_id) {
        $stmt = $pdo->prepare("UPDATE bookings SET room_id=?, status=?, payment_status=? WHERE booking_id=?");
        $stmt->execute([$room_id, $newStatus, $payment_status ?? 'Reserved', $booking_id]);

        // Mark room unavailable
        $stmt = $pdo->prepare("UPDATE rooms SET status='Unavailable' WHERE room_id=?");
        $stmt->execute([$room_id]);
    }

    // ✅ If confirming booking (no room change)
    elseif ($action === 'confirm') {
        $stmt = $pdo->prepare("UPDATE bookings SET status=?, payment_status=? WHERE booking_id=?");
        $stmt->execute([$newStatus, $payment_status ?? 'Reserved', $booking_id]);
    }

    // ✅ For check-in and check-out
    elseif (in_array($action, ['checkin', 'checkout'])) {
        $stmt = $pdo->prepare("UPDATE bookings SET status=? WHERE booking_id=?");
        $stmt->execute([$newStatus, $booking_id]);
    }

    // ✅ For cancel
    elseif ($action === 'cancel') {
        $stmt = $pdo->prepare("UPDATE bookings SET status=?, payment_status='Not Paid' WHERE booking_id=?");
        $stmt->execute([$newStatus, $booking_id]);

        // Optional: free up assigned room
        $pdo->query("UPDATE rooms r 
                     JOIN bookings b ON r.room_id = b.room_id 
                     SET r.status='Available' 
                     WHERE b.booking_id = $booking_id");
    }

    echo json_encode(["success" => true, "status" => $newStatus]);
} catch (Throwable $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

=======
<?php
require_once __DIR__ . '/../../db.php'; // ✅ Correct path to db.php

header('Content-Type: application/json');

$raw = file_get_contents("php://input");
if (empty($raw)) {
    echo json_encode(["success" => false, "message" => "No JSON body received"]);
    exit;
}

$data = json_decode($raw, true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON format", "raw_input" => $raw]);
    exit;
}

$booking_id = $data['booking_id'] ?? null;
$action = $data['action'] ?? null;
$room_id = $data['room_id'] ?? null;
$payment_status = $data['payment_status'] ?? null;

if (!$booking_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing booking_id or action"]);
    exit;
}

// ✅ Define the correct next status depending on action
$statusMap = [
    'assign_room' => 'Confirmed',
    'confirm' => 'Confirmed',
    'checkin' => 'Checked-in',
    'checkout' => 'Checked-out',
    'cancel' => 'Cancelled'
];

$newStatus = $statusMap[$action] ?? null;
if (!$newStatus) {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

try {
    $pdo = get_pdo(); // ✅ use PDO instance from db.php

    // ✅ If assigning a room
    if ($action === 'assign_room' && $room_id) {
        $stmt = $pdo->prepare("UPDATE bookings SET room_id=?, status=?, payment_status=? WHERE booking_id=?");
        $stmt->execute([$room_id, $newStatus, $payment_status ?? 'Reserved', $booking_id]);

        // Mark room unavailable
        $stmt = $pdo->prepare("UPDATE rooms SET status='Unavailable' WHERE room_id=?");
        $stmt->execute([$room_id]);
    }

    // ✅ If confirming booking (no room change)
    elseif ($action === 'confirm') {
        $stmt = $pdo->prepare("UPDATE bookings SET status=?, payment_status=? WHERE booking_id=?");
        $stmt->execute([$newStatus, $payment_status ?? 'Reserved', $booking_id]);
    }

    // ✅ For check-in and check-out
    elseif (in_array($action, ['checkin', 'checkout'])) {
        $stmt = $pdo->prepare("UPDATE bookings SET status=? WHERE booking_id=?");
        $stmt->execute([$newStatus, $booking_id]);
    }

    // ✅ For cancel
    elseif ($action === 'cancel') {
        $stmt = $pdo->prepare("UPDATE bookings SET status=?, payment_status='Not Paid' WHERE booking_id=?");
        $stmt->execute([$newStatus, $booking_id]);

        // Optional: free up assigned room
        $pdo->query("UPDATE rooms r 
                     JOIN bookings b ON r.room_id = b.room_id 
                     SET r.status='Available' 
                     WHERE b.booking_id = $booking_id");
    }

    echo json_encode(["success" => true, "status" => $newStatus]);
} catch (Throwable $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

>>>>>>> b84fe5c (updated backend/reservation/admin-side)
