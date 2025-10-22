<?php

require_once '../db/connect.php';
require_once '../db/log_update.php';
require_once '../config/define.php';

if ($_SERVER["REQUEST_METHOD"] == POST) {
    $username = $_POST['uname'];
    $password = $_POST['psw'];

    // Prepare and execute
    $sql = "SELECT cust_id, username, password FROM plugin_customer WHERE username = ?";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows === 1) {

	    $row = $result->fetch_assoc();

	    // Verify password
	    if (password_verify($password, $row['password'])) {
	    	session_start();
	        //Store session data
	        $_SESSION['username'] = $row['username'];
	        $_SESSION['cust_id']  = $row['cust_id'];

	        //log the login action
	        $action = CUSTOMER_LOGIN_ACTION;
	        $details = CUSTOMER_LOGIN_DETAILS;
	        setCustomerLog($conn, $_SESSION['cust_id'], $action, $details);


	        header(GO_TO_CHATBOT_PAGE); // redirect to dashboard
	        exit();
	    } else {
	        echo "<script>alert('Invalid password.'); window.history.back();</script>";
	    }
	} else {

	    echo "<script>alert('No user found.'); window.history.back();</script>";
	}

	$stmt->close();
	$conn->close();
}




?>