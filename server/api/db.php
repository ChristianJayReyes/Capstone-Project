<?php 
$host = "mysql-rosarioresortshotel.alwaysdata.net";
$password = "rosarioresorts";
$user = "423538";
$dbname = "rosarioresortshotel_db";

$conn = new mysqli($host,$user,$pass,$dbname);
if ($conn->connect_error){
    die(json_encode(["success"=>false,"message"=>"Connection Failed: ".$conn->connect_error]));
}

$conn->set_charset("utf8");
?>