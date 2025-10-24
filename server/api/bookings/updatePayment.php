<<<<<<< HEAD
<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();
    $data = json_decode(file_get_contents('php://input'), true);
    $booking_id = $data['booking_id'];
    $payment_status = $data['payment_status']; // Reserved or Paid

    $stmt = $pdo->prepare("UPDATE bookings SET payment_status = ? WHERE booking_id = ?");
    $stmt->execute([$payment_status, $booking_id]);

    respond_json(200, [
        'success' => true,
        'message' => 'Payment status updated.'
    ]);

} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to update payment status',
        'error' => $e->getMessage()
    ]);
}
?>
=======
<?php
require_once __DIR__ . '/../../db.php';

try {
    $pdo = get_pdo();
    $data = json_decode(file_get_contents('php://input'), true);
    $booking_id = $data['booking_id'];
    $payment_status = $data['payment_status']; // Reserved or Paid

    $stmt = $pdo->prepare("UPDATE bookings SET payment_status = ? WHERE booking_id = ?");
    $stmt->execute([$payment_status, $booking_id]);

    respond_json(200, [
        'success' => true,
        'message' => 'Payment status updated.'
    ]);

} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to update payment status',
        'error' => $e->getMessage()
    ]);
}
?>
>>>>>>> b84fe5c (updated backend/reservation/admin-side)
