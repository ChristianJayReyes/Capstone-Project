<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$raw = trim(file_get_contents("php://input"));
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or empty JSON",
    ]);
    exit;
}

$booking_id = $data['booking_id'] ?? null;
$action = strtolower(trim($data['action'] ?? ''));

if (!$booking_id || !$action) {
    echo json_encode(["success" => false, "message" => "Missing booking_id or action"]);
    exit;
}

// Booking + Payment transitions (room status removed, manual control)
$statusMap = [
    'checkin'  => ['Checked-in', 'Paid'],
    'checkout' => ['Checked-out', 'Paid'],
    'cancel'   => ['Cancelled', 'Refunded']
];

if (!isset($statusMap[$action])) {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

[$newStatus, $newPaymentStatus] = $statusMap[$action];

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare("
        UPDATE bookings 
        SET status = ?, payment_status = ? 
        WHERE booking_id = ?
    ");
    $stmt->execute([$newStatus, $newPaymentStatus, $booking_id]);

    echo json_encode([
        "success" => true,
        "message" => "Booking status updated successfully.",
        "status" => $newStatus,
        "payment_status" => $newPaymentStatus
    ]);

} catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => $e->getMessage()
    ]);
}
