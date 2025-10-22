<?php
require_once 'connect.php';

function checkUniqueUsername(mysqli $conn, string $username){
	// global $conn; 
	$username = trim($username);
    if ($username === '') return false;

    try {
        $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM plugin_customer WHERE username = ?");
        if (!$stmt) {
            error_log("[checkUniqueUsername] prepare failed: " . $conn->error);
            return false;
        }
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($cnt);
        $stmt->fetch();
        $stmt->close();

        return $cnt == 0;
    } catch (Throwable $e) {
        error_log("[checkUniqueUsername] DB error: " . $e->getMessage());
        return false;
    }
}

function getCustomerId(mysqli $conn, string $username){
	$sql_select_id = "SELECT cust_id FROM plugin_customer WHERE username = ?";
	$stmt = $conn->prepare($sql_select_id);
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$result = $stmt->get_result();
	$row = $result->fetch_assoc();
	$result_id = $row['cust_id'];
	return $result_id;
}

function loadChatPreferences() {
    global $conn;

    $sql = "SELECT * FROM plugin_preference LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Convert avatar_img (BLOB) into base64 if not null
    if (!empty($row['avatar_img'])) {
        $row['avatar_img'] = 'data:image/png;base64,' . base64_encode($row['avatar_img']);
    }

    return $row;
}


?>