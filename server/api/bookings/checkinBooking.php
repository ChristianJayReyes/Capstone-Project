<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';

try {
    $pdo = get_pdo();
    $input = json_input();
    $input = required($input, ['booking_id', 'admin_id']);
    
    $bookingId = (int)$input['booking_id'];
    $adminId = (int)$input['admin_id'];
    $checkInTime = $input['check_in_time'] ?? date('Y-m-d H:i:s');
    
    $pdo->beginTransaction();
    
    // Get booking details
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        $pdo->rollBack();
        respond_json(404, ['success' => false, 'message' => 'Booking not found']);
    }
    
    if ($booking['status'] !== 'Confirmed') {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Only confirmed bookings can be checked in']);
    }
    
    // Update booking status and check-in time
    $stmt = $pdo->prepare("UPDATE bookings SET status = 'Checked-in', check_in_time = ? WHERE booking_id = ?");
    $stmt->execute([$checkInTime, $bookingId]);

    // Set assigned rooms to Occupied
$stmt = $pdo->prepare("SELECT br.room_id FROM booking_rooms br WHERE br.booking_id = ?");
$stmt->execute([$bookingId]);
$assignedRooms = $stmt->fetchAll();

foreach ($assignedRooms as $room) {
    $stmt = $pdo->prepare("UPDATE rooms SET status = 'Occupied' WHERE room_id = ?");
    $stmt->execute([$room['room_id']]);
}

    
    // Add booking log
    $stmt = $pdo->prepare("INSERT INTO booking_logs (booking_id, action, admin_id) VALUES (?, 'checked_in', ?)");
    $stmt->execute([$bookingId, $adminId]);
    
    $pdo->commit();
    
    respond_json(200, [
        'success' => true,
        'message' => 'Guest checked in successfully'
    ]);
    
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to check in guest',
        'error' => $e->getMessage()
    ]);
}

?>
