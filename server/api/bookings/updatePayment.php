<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();
    $data = json_decode(file_get_contents('php://input'), true);
    $booking_id = $data['booking_id'];
    $payment_status = $data['payment_status'];

    // Allow only 'Reserved' or 'Paid'
    if (!in_array($payment_status, ['Reserved', 'Paid'])) {
        respond_json(400, [
            'success' => false,
            'message' => 'Invalid payment status value.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE bookings SET payment_status = ? WHERE booking_id = ?");
    $stmt->execute([$payment_status, $booking_id]);

    respond_json(200, [
        'success' => true,
        'message' => 'Payment status updated successfully.'
    ]);

} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to update payment status.',
        'error' => $e->getMessage()
    ]);
}
