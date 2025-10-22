<?php
//keyword_scope.php

require_once '../ai/chatbot_send.php'; // include AI function
require_once '../config/define.php';

header(JSON_APPICATION);
$jsonData = file_get_contents(KEYWORD_DATA);

$data = json_decode($jsonData, true);

$input = json_decode(file_get_contents(PHP_INPUT), true);
$message = $input['message'] ?? ' ';
// Check keyword
// 1.No keyword matched => out of scope => reject to respond+FAQ
function offTopic($msg) {
	global $data;
	// categorised keywords
    $off_keywords = $data["Off-topic"]["keywords"];
    $sensitive_keywords = $data["Sensitive"]["keywords"];
    $on_keywords = $data["IT Service"]["keywords"];
    $off_count = 0;
    $sen_count = 0;
    $on_count = 0;
    // Lowercase message for comparison
    $lowerMsg = strtolower($msg);

	// Off-topic keyword counting
    foreach ($off_keywords as $word) {
        if (strpos($lowerMsg, strtolower($word)) !== false) {
            $off_count = $off_count+1;
        }
    }
    // On-topic keyword counting
    foreach ($on_keywords as $word) {
        if (strpos($lowerMsg, strtolower($word)) !== false) {
            $on_count = $on_count+1;

        }
    }
    // semsitive-topic keyword counting
    foreach ($sensitive_keywords as $word) {
        if (strpos($lowerMsg, strtolower($word)) !== false) {
            $sen_count = $sen_count+1;

        }
    }
    
    return $on_count/($off_count+$sen_count+1);

} 



if (offTopic($message) < 0.8){//out of scope
	$reply = "Sorry, but that request is outside what I can help with. Please send me a different topic.You can also refer to our common FAQ list below for supported topics and quick answers.";
	// 1.a Provide FAQ categories for users to choose   

    echo json_encode(
    	['response' => $reply, 
    	'faq_topics' => "required"
		]);
}else{//in the topic
// 1.b Provide the common questions based on what domain user select
//call AI for reply
	 $reply = getAIResponse($message);
	 echo json_encode(['response' => $reply]);
}


// 2. Some matched but some are not (1-90%) =>low confidence => FAQ + flag the ticket
// 3. 90% matched => low confidence=>still answer + FAQ + flag the ticket
// 4. 90% matched=>high confidence=> answer
