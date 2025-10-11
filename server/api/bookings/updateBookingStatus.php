<?php
header('Content-Type: application/json');
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['booking_id']) || !isset($data['action'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

$booking_id = intval($data['booking_id']);
$action = strtolower(trim($data['action']));
$admin_id = isset($data['admin_id']) ? intval($data['admin_id']) : null;
$time = $data['time'] ?? date('Y-m-d H:i:s');
$room_id = isset($data['room_id']) ? intval($data['room_id']) : null;

try {
    $conn = get_pdo();

    // Fetch booking info (for logs)
    $stmt = $conn->prepare("SELECT * FROM bookings WHERE booking_id = ?");
    $stmt->execute([$booking_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        exit;
    }

    // --- CONFIRM ---
    if ($action === 'confirm') {
        if (!$room_id) {
            echo json_encode(['success' => false, 'message' => 'Room ID is required for confirmation']);
            exit;
        }

        $stmt = $conn->prepare("
            UPDATE bookings 
            SET status = 'Confirmed', payment_status = 'Reserved', room_id = ?, updated_at = NOW() 
            WHERE booking_id = ?
        ");
        $stmt->execute([$room_id, $booking_id]);

        // Room occupied
        $stmt = $conn->prepare("UPDATE rooms SET status = 'Occupied' WHERE room_id = ?");
        $stmt->execute([$room_id]);

        echo json_encode(['success' => true, 'message' => 'Booking confirmed and room occupied']);
        exit;
    }

    // --- CANCEL ---
    if ($action === 'cancel') {
        // Free up room
        if (!empty($booking['room_id'])) {
            $stmt = $conn->prepare("UPDATE rooms SET status = 'Available' WHERE room_id = ?");
            $stmt->execute([$booking['room_id']]);
        }

        // Update booking
        $stmt = $conn->prepare("
            UPDATE bookings 
            SET status = 'Cancelled', payment_status = 'Not Paid', updated_at = NOW() 
            WHERE booking_id = ?
        ");
        $stmt->execute([$booking_id]);

        // Move to logs
        $stmt = $conn->prepare("
            INSERT INTO booking_logs (booking_id, user_id, room_id, status, payment_status, action_time, action_by)
            VALUES (?, ?, ?, 'Cancelled', 'Not Paid', NOW(), ?)
        ");
        $stmt->execute([$booking_id, $booking['user_id'], $booking['room_id'], $admin_id]);

        echo json_encode(['success' => true, 'message' => 'Booking cancelled, room released, and logged']);
        exit;
    }

    // --- CHECK-IN ---
    if ($action === 'checkin') {
        $stmt = $conn->prepare("
            UPDATE bookings 
            SET status = 'Checked-in', check_in_time = ?, updated_at = NOW() 
            WHERE booking_id = ?
        ");
        $stmt->execute([$time, $booking_id]);

        echo json_encode(['success' => true, 'message' => 'Guest checked in']);
        exit;
    }

    // --- CHECK-OUT ---
    if ($action === 'checkout') {
        // Free up room
        if (!empty($booking['room_id'])) {
            $stmt = $conn->prepare("UPDATE rooms SET status = 'Available' WHERE room_id = ?");
            $stmt->execute([$booking['room_id']]);
        }

        // Update booking
        $stmt = $conn->prepare("
            UPDATE bookings 
            SET status = 'Checked-out', check_out_time = ?, payment_status = 'Paid', updated_at = NOW() 
            WHERE booking_id = ?
        ");
        $stmt->execute([$time, $booking_id]);

        // Move to logs
        $stmt = $conn->prepare("
            INSERT INTO booking_logs (booking_id, user_id, room_id, status, payment_status, action_time, action_by)
            VALUES (?, ?, ?, 'Checked-out', 'Paid', NOW(), ?)
        ");
        $stmt->execute([$booking_id, $booking['user_id'], $booking['room_id'], $admin_id]);

        echo json_encode(['success' => true, 'message' => 'Guest checked out, room released, and logged']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Invalid action']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
