<?php
declare(strict_types=1);

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../helper.php';

    try {
        $pdo = get_pdo();
        
        // Build WHERE clause based on filters
        $where = [];
        $params = [];
        
        // Search filter
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = sanitize_string($_GET['search']);
            $where[] = "(r.room_number LIKE :search OR rt.type_name LIKE :search)";
            $params[':search'] = "%{$search}%";
        }
        
        // Room type filter
        if (isset($_GET['room_type']) && $_GET['room_type'] !== 'all') {
            $roomType = sanitize_string($_GET['room_type']);
            $where[] = "rt.type_name = :room_type";
            $params[':room_type'] = $roomType;
        }
        
        // Status filter
        if (isset($_GET['status']) && $_GET['status'] !== 'all') {
            $status = sanitize_string($_GET['status']);
            $where[] = "r.status = :status";
            $params[':status'] = $status;
        }
        
        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $sql = "SELECT 
            r.room_id,
            r.room_number,
            r.status,
            rt.room_type_id,
            rt.type_name,
            rt.capacity_adults,
            rt.capacity_children,
            rt.price_per_night
        FROM rooms r
        JOIN room_types rt ON rt.room_type_id = r.room_type_id
        {$whereClause}
        ORDER BY r.room_number";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rooms = $stmt->fetchAll();
        
        respond_json(200, [
            'success' => true,
            'count' => count($rooms),   
            'data' => $rooms,
            'message' => $rooms ? '' : 'No rooms found'
        ]);
        
    } catch (Throwable $e) {
        respond_json(500, [
            'success' => false,
            'message' => 'Failed to fetch rooms',
            'error' => $e->getMessage()
        ]);
    }
