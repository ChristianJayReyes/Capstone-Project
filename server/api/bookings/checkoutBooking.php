<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';

try {
    $pdo = get_pdo();
    $input = json_input();
    $input = required($input, ['booking_id', 'admin_id']);
    
    $bookingId = (int)$input['booking_id'];
    $adminId = (int)$input['admin_id'];
    $checkOutTime = $input['check_out_time'] ?? date('Y-m-d H:i:s');
    
    $pdo->beginTransaction();
    
    // Get booking details
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        $pdo->rollBack();
        respond_json(404, ['success' => false, 'message' => 'Booking not found']);
    }
    
    if ($booking['status'] !== 'Checked-in') {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Only checked-in bookings can be checked out']);
    }
    
    // Update booking status and check-out time
    $stmt = $pdo->prepare("UPDATE bookings SET status = 'Checked-out', check_out_time = ? WHERE booking_id = ?");
    $stmt->execute([$checkOutTime, $bookingId]);
    
    // Get assigned room and make it available
    $stmt = $pdo->prepare("SELECT br.room_id FROM booking_rooms br WHERE br.booking_id = ?");
$stmt->execute([$bookingId]);
$assignedRooms = $stmt->fetchAll();

foreach ($assignedRooms as $room) {
    $stmt = $pdo->prepare("UPDATE rooms SET status = 'Available' WHERE room_id = ?");
    $stmt->execute([$room['room_id']]);
}

    
    // Add booking log
    $stmt = $pdo->prepare("INSERT INTO booking_logs (booking_id, action, admin_id) VALUES (?, 'checked_out', ?)");
    $stmt->execute([$bookingId, $adminId]);
    
    $pdo->commit();
    
    respond_json(200, [
        'success' => true,
        'message' => 'Guest checked out successfully'
    ]);
    
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to check out guest',
        'error' => $e->getMessage()
    ]);
}

?>
