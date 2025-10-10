<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../db.php';

try {
    $pdo = get_pdo();

    // Larger sample bookings
    $sampleBookings = [
        ['user_id'=>48,'full_name'=>'John Doe','email'=>'john@example.com','room_id'=>1,'room_number'=>'101','type_name'=>'Deluxe','check_in_date'=>'2025-10-05','check_out_date'=>'2025-10-07','guests'=>2,'status'=>'confirmed','total_price'=>3500,'payment_method'=>'Cash'],
        ['user_id'=>49,'full_name'=>'Jane Smith','email'=>'jane@example.com','room_id'=>2,'room_number'=>'102','type_name'=>'Standard','check_in_date'=>'2025-10-06','check_out_date'=>'2025-10-08','guests'=>1,'status'=>'pending','total_price'=>2000,'payment_method'=>'Card'],
        ['user_id'=>50,'full_name'=>'Alice Johnson','email'=>'alice@example.com','room_id'=>3,'room_number'=>'103','type_name'=>'Suite','check_in_date'=>'2025-10-07','check_out_date'=>'2025-10-09','guests'=>3,'status'=>'checked-in','total_price'=>5000,'payment_method'=>'Cash'],
        ['user_id'=>51,'full_name'=>'Bob Williams','email'=>'bob@example.com','room_id'=>4,'room_number'=>'104','type_name'=>'Deluxe','check_in_date'=>'2025-10-08','check_out_date'=>'2025-10-10','guests'=>2,'status'=>'cancelled','total_price'=>3000,'payment_method'=>'Card'],
        ['user_id'=>52,'full_name'=>'Charlie Brown','email'=>'charlie@example.com','room_id'=>5,'room_number'=>'105','type_name'=>'Standard','check_in_date'=>'2025-10-09','check_out_date'=>'2025-10-11','guests'=>1,'status'=>'pending','total_price'=>1800,'payment_method'=>'Cash'],
        ['user_id'=>53,'full_name'=>'Diana Prince','email'=>'diana@example.com','room_id'=>1,'room_number'=>'106','type_name'=>'Suite','check_in_date'=>'2025-10-10','check_out_date'=>'2025-10-12','guests'=>2,'status'=>'confirmed','total_price'=>4000,'payment_method'=>'Card'],
        ['user_id'=>54,'full_name'=>'Ethan Hunt','email'=>'ethan@example.com','room_id'=>2,'room_number'=>'107','type_name'=>'Deluxe','check_in_date'=>'2025-10-11','check_out_date'=>'2025-10-13','guests'=>1,'status'=>'checked-in','total_price'=>3500,'payment_method'=>'Cash'],
        ['user_id'=>48,'full_name'=>'John Doe','email'=>'john@example.com','room_id'=>3,'room_number'=>'108','type_name'=>'Standard','check_in_date'=>'2025-10-12','check_out_date'=>'2025-10-14','guests'=>2,'status'=>'no-show','total_price'=>2200,'payment_method'=>'Card'],
        ['user_id'=>49,'full_name'=>'Jane Smith','email'=>'jane@example.com','room_id'=>4,'room_number'=>'109','type_name'=>'Suite','check_in_date'=>'2025-10-13','check_out_date'=>'2025-10-15','guests'=>3,'status'=>'pending','total_price'=>4800,'payment_method'=>'Cash'],
        ['user_id'=>50,'full_name'=>'Alice Johnson','email'=>'alice@example.com','room_id'=>5,'room_number'=>'110','type_name'=>'Deluxe','check_in_date'=>'2025-10-14','check_out_date'=>'2025-10-16','guests'=>1,'status'=>'confirmed','total_price'=>3500,'payment_method'=>'Card'],
        ['user_id'=>51,'full_name'=>'Bob Williams','email'=>'bob@example.com','room_id'=>1,'room_number'=>'111','type_name'=>'Standard','check_in_date'=>'2025-10-15','check_out_date'=>'2025-10-17','guests'=>2,'status'=>'checked-in','total_price'=>2500,'payment_method'=>'Cash'],
        ['user_id'=>52,'full_name'=>'Charlie Brown','email'=>'charlie@example.com','room_id'=>2,'room_number'=>'112','type_name'=>'Suite','check_in_date'=>'2025-10-16','check_out_date'=>'2025-10-18','guests'=>3,'status'=>'cancelled','total_price'=>5000,'payment_method'=>'Card'],
        ['user_id'=>53,'full_name'=>'Diana Prince','email'=>'diana@example.com','room_id'=>3,'room_number'=>'113','type_name'=>'Deluxe','check_in_date'=>'2025-10-17','check_out_date'=>'2025-10-19','guests'=>2,'status'=>'pending','total_price'=>3600,'payment_method'=>'Cash'],
        ['user_id'=>54,'full_name'=>'Ethan Hunt','email'=>'ethan@example.com','room_id'=>4,'room_number'=>'114','type_name'=>'Standard','check_in_date'=>'2025-10-18','check_out_date'=>'2025-10-20','guests'=>1,'status'=>'confirmed','total_price'=>2100,'payment_method'=>'Card'],
        ['user_id'=>48,'full_name'=>'John Doe','email'=>'john@example.com','room_id'=>5,'room_number'=>'115','type_name'=>'Suite','check_in_date'=>'2025-10-19','check_out_date'=>'2025-10-21','guests'=>2,'status'=>'checked-in','total_price'=>4800,'payment_method'=>'Cash']
    ];

    $stmt = $pdo->prepare("INSERT INTO bookings (user_id, room_id, room_number, full_name, email, type_name, check_in_date, check_out_date, guests, status, total_price, payment_method, created_at) 
        VALUES (:user_id, :room_id, :room_number, :full_name, :email, :type_name, :check_in_date, :check_out_date, :guests, :status, :total_price, :payment_method, NOW())");

    foreach ($sampleBookings as $b) {
        $stmt->execute($b);
    }

    echo json_encode([
        "success" => true,
        "message" => "15 sample bookings inserted successfully!"
    ]);

} catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
