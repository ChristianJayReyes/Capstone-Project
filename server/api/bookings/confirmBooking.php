<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../email.php';

try {
    $pdo = get_pdo();
    $input = json_input();
    $input = required($input, ['booking_id', 'room_id', 'admin_id']);
    
    $bookingId = (int)$input['booking_id'];
    $roomId = (int)$input['room_id'];
    $adminId = (int)$input['admin_id'];
    
    $pdo->beginTransaction();
    
    // Get booking details
    $stmt = $pdo->prepare("
        SELECT b.*, u.full_name, u.email, rt.type_name 
        FROM bookings b 
        JOIN users u ON u.user_id = b.user_id 
        JOIN room_types rt ON rt.room_type_id = b.room_type_id 
        WHERE b.booking_id = ? FOR UPDATE
    ");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch();
    
    if (!$booking) {
        $pdo->rollBack();
        respond_json(404, ['success' => false, 'message' => 'Booking not found']);
    }
    
    if ($booking['status'] !== 'Pending') {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Only pending bookings can be confirmed']);
    }
    
    // Get room details
    $stmt = $pdo->prepare("SELECT * FROM rooms WHERE room_id = ? FOR UPDATE");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch();
    
    if (!$room) {
        $pdo->rollBack();
        respond_json(404, ['success' => false, 'message' => 'Room not found']);
    }
    
    if ($room['status'] !== 'Available') {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Room is not available']);
    }
    
    if ($room['room_type_id'] != $booking['room_type_id']) {
        $pdo->rollBack();
        respond_json(400, ['success' => false, 'message' => 'Room type mismatch']);
    }
    
    // Update booking status
    $stmt = $pdo->prepare("UPDATE bookings SET status = 'Confirmed' WHERE booking_id = ?");
    $stmt->execute([$bookingId]);
    
    // Assign room to booking
    $stmt = $pdo->prepare("INSERT INTO booking_rooms (booking_id, room_id) VALUES (?, ?)");
    $stmt->execute([$bookingId, $roomId]);
    
    // Update room status
    $stmt = $pdo->prepare("UPDATE rooms SET status = 'Booked' WHERE room_id = ?");
    $stmt->execute([$roomId]);
    
    // Add booking log
    $stmt = $pdo->prepare("INSERT INTO booking_logs (booking_id, action, admin_id) VALUES (?, 'confirmed', ?)");
    $stmt->execute([$bookingId, $adminId]);
    
    // Calculate total price if not set
    if (!$booking['total_price']) {
        $checkIn = new DateTime($booking['check_in_date']);
        $checkOut = new DateTime($booking['check_out_date']);
        $nights = $checkIn->diff($checkOut)->days;
        
        $stmt = $pdo->prepare("SELECT price_per_night FROM room_types WHERE room_type_id = ?");
        $stmt->execute([$booking['room_type_id']]);
        $roomType = $stmt->fetch();
        $totalPrice = $nights * $roomType['price_per_night'];
        
        $stmt = $pdo->prepare("UPDATE bookings SET total_price = ? WHERE booking_id = ?");
        $stmt->execute([$totalPrice, $bookingId]);
        $booking['total_price'] = $totalPrice;
    }
    
    $pdo->commit();
    
    // Send confirmation email
    $emailData = [
        'booking_id' => $bookingId,
        'room_type' => $booking['type_name'],
        'room_number' => $room['room_number'],
        'check_in_date' => $booking['check_in_date'],
        'check_out_date' => $booking['check_out_date'],
        'total_price' => $booking['total_price']
    ];
    
    $emailResult = send_booking_confirmation($booking['email'], $booking['full_name'], $emailData);
    
    // Log email result
    $stmt = $pdo->prepare("INSERT INTO booking_logs (booking_id, action, admin_id) VALUES (?, ?, ?)");
    $stmt->execute([$bookingId, $emailResult['success'] ? 'confirmation_email_sent' : 'email_failed', $adminId]);
    
    respond_json(200, [
        'success' => true,
        'message' => 'Booking confirmed successfully',
        'email_sent' => $emailResult['success']
    ]);
    
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to confirm booking',
        'error' => $e->getMessage()
    ]);
}

?>
