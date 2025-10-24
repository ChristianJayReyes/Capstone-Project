<<<<<<< HEAD
<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../helper.php';


try {
    $pdo = get_pdo();
    
    // Build WHERE clause based on filters
    $where = [];
    $params = [];
    
    // Search filter
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = sanitize_string($_GET['search']);
        $where[] = "(u.full_name LIKE :search OR u.email LIKE :search OR u.phone LIKE :search)";
        $params[':search'] = "%{$search}%";
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "SELECT 
        u.user_id as guest_id,
        u.full_name as name,
        u.email,
        u.phone,
        u.created_at,
        COALESCE(COUNT(b.booking_id), 0) AS total_bookings,
        COALESCE(MAX(b.check_out_date), NULL) AS last_stay
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.user_id
    {$whereClause}
    GROUP BY u.user_id, u.full_name, u.email, u.phone, u.created_at
    ORDER BY last_stay DESC NULLS LAST, u.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $guests = $stmt->fetchAll();
    
    respond_json(200, [
        'success' => true,
        'data' => $guests
    ]);
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch guests',
        'error' => $e->getMessage()
    ]);
}

?>
=======
<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../helper.php';


try {
    $pdo = get_pdo();
    
    // Build WHERE clause based on filters
    $where = [];
    $params = [];
    
    // Search filter
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = sanitize_string($_GET['search']);
        $where[] = "(u.full_name LIKE :search OR u.email LIKE :search OR u.phone LIKE :search)";
        $params[':search'] = "%{$search}%";
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "SELECT 
        u.user_id as guest_id,
        u.full_name as name,
        u.email,
        u.phone,
        u.created_at,
        COALESCE(COUNT(b.booking_id), 0) AS total_bookings,
        COALESCE(MAX(b.check_out_date), NULL) AS last_stay
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.user_id
    {$whereClause}
    GROUP BY u.user_id, u.full_name, u.email, u.phone, u.created_at
    ORDER BY last_stay DESC NULLS LAST, u.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $guests = $stmt->fetchAll();
    
    respond_json(200, [
        'success' => true,
        'data' => $guests
    ]);
    
} catch (Throwable $e) {
    respond_json(500, [
        'success' => false,
        'message' => 'Failed to fetch guests',
        'error' => $e->getMessage()
    ]);
}

?>
>>>>>>> b84fe5c (updated backend/reservation/admin-side)
