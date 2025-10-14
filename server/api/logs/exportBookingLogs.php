<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../helper.php';

try {
    $pdo = get_pdo();
    
    // Build WHERE clause based on filters (same as getBookingLogs.php)
    $where = [];
    $params = [];
    
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = sanitize_string($_GET['search']);
        $where[] = "(b.booking_id LIKE :search OR u.full_name LIKE :search OR r.room_number LIKE :search)";
        $params[':search'] = "%{$search}%";
    }
    
    if (isset($_GET['status']) && $_GET['status'] !== 'All') {
        $status = sanitize_string($_GET['status']);
        $where[] = "b.status = :status";
        $params[':status'] = $status;
    }
    
    if (isset($_GET['room_type']) && $_GET['room_type'] !== 'All') {
        $roomType = sanitize_string($_GET['room_type']);
        $where[] = "rt.type_name = :room_type";
        $params[':room_type'] = $roomType;
    }
    
    if (isset($_GET['date_from']) && !empty($_GET['date_from'])) {
        $where[] = "b.check_in_date >= :date_from";
        $params[':date_from'] = $_GET['date_from'];
    }
    
    if (isset($_GET['date_to']) && !empty($_GET['date_to'])) {
        $where[] = "b.check_in_date <= :date_to";
        $params[':date_to'] = $_GET['date_to'];
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "SELECT 
        bl.log_id,
        bl.booking_id,
        bl.action,
        bl.timestamp,
        b.status as booking_status,
        u.full_name as guest_name,
        u.email as guest_email,
        u.phone as guest_phone,
        rt.type_name as room_type,
        r.room_number,
        b.check_in_date,
        b.check_out_date,
        b.total_price,
        b.check_in_time,
        b.check_out_time,
        admin.full_name as admin_name
    FROM booking_logs bl
    JOIN bookings b ON b.booking_id = bl.booking_id
    JOIN users u ON u.user_id = b.user_id
    JOIN room_types rt ON rt.room_type_id = b.room_type_id
    LEFT JOIN rooms r ON r.room_id = (
        SELECT br.room_id FROM booking_rooms br WHERE br.booking_id = b.booking_id LIMIT 1
    )
    LEFT JOIN users admin ON admin.user_id = bl.admin_id
    {$whereClause}
    ORDER BY bl.timestamp DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    // Set headers for CSV download
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="booking_logs_' . date('Y-m-d_H-i-s') . '.csv"');
    
    // Create CSV output
    $output = fopen('php://output', 'w');
    
    // CSV headers
    fputcsv($output, [
        'Log ID',
        'Booking ID',
        'Action',
        'Timestamp',
        'Booking Status',
        'Guest Name',
        'Guest Email',
        'Guest Phone',
        'Room Type',
        'Room Number',
        'Check-in Date',
        'Check-out Date',
        'Total Price',
        'Check-in Time',
        'Check-out Time',
        'Admin Name'
    ]);
    
    // CSV data
    foreach ($logs as $log) {
        fputcsv($output, [
            $log['log_id'],
            $log['booking_id'],
            $log['action'],
            $log['timestamp'],
            $log['booking_status'],
            $log['guest_name'],
            $log['guest_email'],
            $log['guest_phone'],
            $log['room_type'],
            $log['room_number'],
            $log['check_in_date'],
            $log['check_out_date'],
            $log['total_price'],
            $log['check_in_time'],
            $log['check_out_time'],
            $log['admin_name']
        ]);
    }
    
    fclose($output);
    exit;
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to export booking logs',
        'error' => $e->getMessage()
    ]);
}

?>
