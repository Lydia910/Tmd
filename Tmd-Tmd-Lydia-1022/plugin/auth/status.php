<?php
require_once 'login.php';
session_start();
header('Content-Type: application/json');
echo json_encode(['logged_in' => isset($_SESSION['cust_id'])]);