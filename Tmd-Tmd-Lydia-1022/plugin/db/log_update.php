<?php


//insert record into customer log
function setCustomerLog($conn,$id, $action, $details){
	$sql_log = "INSERT INTO `plugin_customer_log` (`cust_id`, `action`, `details`, `timestamp`) VALUES (?,?,?, CURRENT_TIMESTAMP)";
	
	$stmt = $conn->prepare($sql_log);
	$stmt->bind_param("iss", $id, $action,$details);
	$stmt->execute();
	$stmt->close();
	
}

//insert record into ticket log
function setTicketLog($conn, $ticket,$user, $action, $details){
	$sql_log = "INSERT INTO `plugin_ticket_log` (`ticket_id`, `user_id`, `action`, `details`, `timestamp`) VALUES (?,?,?,?, CURRENT_TIMESTAMP)";
	
	$stmt = $conn->prepare($sql_log);
	$stmt->bind_param("iiss", $ticket, $user, $action, $details);
	$stmt->execute();
	$stmt->close();
}
		

?>