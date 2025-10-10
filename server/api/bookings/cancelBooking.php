<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {
    $pdo = get_pdo();
    $input = json_input();
    $input = required($input, ['booking_id', 'admin_id']);
    
    $bookingId = (int)$input['booking_id'];
    $adminId = (int)$input['admin_id'];
    
    $pdo->beginTransaction();
    
    // Get booking details
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        $pdo->rollBack();
        respond_json(404, ['success' => false, 'message' => 'Booking not found']);
    }
    
    if ($booking['status'] === 'Cancelled') {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Booking is already cancelled']);
    }
    
    // Update booking status
    $stmt = $pdo->prepare("UPDATE bookings SET status = 'Cancelled' WHERE booking_id = ?");
    $stmt->execute([$bookingId]);
    
    // If room was assigned, make it available again
   $stmt = $pdo->prepare("SELECT br.room_id FROM booking_rooms br WHERE br.booking_id = ?");
$stmt->execute([$bookingId]);
$assignedRooms = $stmt->fetchAll();

foreach ($assignedRooms as $room) {
    $stmt = $pdo->prepare("UPDATE rooms SET status = 'Available' WHERE room_id = ?");
    $stmt->execute([$room['room_id']]);
}

    
    // Add booking log
    $stmt = $pdo->prepare("INSERT INTO booking_logs (booking_id, action, admin_id) VALUES (?, 'cancelled', ?)");
    $stmt->execute([$bookingId, $adminId]);
    
    $pdo->commit();
    
    respond_json(200, [
        'success' => true,
        'message' => 'Booking cancelled successfully'
    ]);
    
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to cancel booking',
        'error' => $e->getMessage()
    ]);
}

?>
