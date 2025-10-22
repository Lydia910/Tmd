<?php
require_once '../db/log_update.php';
require_once '../config/define.php';

session_start();      // Start the session


if (isset($_SESSION['cust_id'])) {
    // Log the logout action before destroying the session
    $cust_id = $_SESSION['cust_id']; 
    $action = CUSTOMER_LOGOUT_ACTION;
    $details = CUSTOMER_LOGOUT_DETAILS;
    setCustomerLog($cust_id, $action, $details);
}


session_unset();      // Remove all session variables
session_destroy();    // Destroy the session

// Redirect back to login page
header(GO_TO_LOGIN_PAGE);
exit();
?>
