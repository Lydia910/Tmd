<?php

require_once __DIR__ . '/connect.php';
require_once __DIR__ . '/log_update.php';
require_once __DIR__ . '/db.function.php';
require_once __DIR__ . '/../config/define.php';



if ($_SERVER["REQUEST_METHOD"] == POST) {
	
    $username = $_POST['uname'];
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $password = $_POST['psw'];
	
	if (!empty($username)&&!empty($fname)&&!empty($lname)&&!empty($email)&&!empty($password)) {

		//check unique username
	    $check =  (bool) json_encode(checkUniqueUsername($conn, $username)); 
		if($check== false){
			// echo $check;
			echo "<script>alert('The username has been used. Try other name.'); window.history.back();</script>";
		}
		elseif (strpos($password, ' ') !== false) {
			echo "<script>alert('Password cannot contain spaces.'); window.history.back();</script>";
		    
		} 
		
		else{
			// Prepare and execute
		    $sql = "INSERT INTO `plugin_customer`(`first_name`, `last_name`, `email`, `password`, `username`) VALUES (?,?,?,?,?)";
			$stmt = $conn->prepare($sql);
			// Hash password
	    	$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
			$stmt->bind_param("sssss", $fname, $lname, $email,$hashedPassword, $username);
			$stmt->execute();

			//select our datarow to get id
			$result_id = (int) json_encode(getCustomerId($conn, $username));

			//insert action into log
			$action = CUSTOMER_REGIST_ACTION;
			$details = CUSTOMER_REGIST_DETAILS;

			setCustomerLog($conn, $result_id,$action,$details);

		    header(GO_TO_LOGIN_PAGE); //TODO: can change to chatbot but need to have a login function to start session
		    exit();
		}
		
	    
	} else {
		echo "<script>alert('Please fill in all fields.'); window.history.back();</script>";
	}

	$stmt->close();
	$conn->close();
}


?>