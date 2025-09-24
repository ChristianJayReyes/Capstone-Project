<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "mysql-rosarioresortshotel.alwaysdata.net";
$password = "rosarioresorts";
$user = "423538";
$dbname = "rosarioresortshotel_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection Failed: "]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$email = $conn->real_escape_string($data->email);
$password = $data["password"];

$sql = "SELECT * FROM users WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user["password"])) {
        echo json_encode(["success" => true, "message" => "Login Successful", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid Password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User Not Found"]);
}

$conn->close();
