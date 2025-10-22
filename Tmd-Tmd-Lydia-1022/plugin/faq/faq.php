<?php
// faq.php
require_once '../config/define.php';

$jsonData = file_get_contents(FAQ_DATA);
// Simple FAQ data
$data = json_decode($jsonData, true);

$faqs = [];
foreach ($data as $item) {
    $faqs[$item["Category"]][$item["Question"]] = $item["ExampleResponse_EN"];
}

// Get distinct categories
$categories = array_keys($faqs);

// Get selected FAQ
$topic = $_GET['topic'] ?? null;
$question = $_GET['question'] ?? null;


header(JSON_APPICATION);

// If topic and question → return answer
if ($topic && $question && isset($faqs[$topic][$question])) {
    echo json_encode(["answer" => $faqs[$topic][$question]]);
}
// If topic only → return all questions in that topic
elseif ($topic && isset($faqs[$topic])) {
    echo json_encode(["questions" => array_keys($faqs[$topic])]);
}
// No topic → return all topics
else {
    echo json_encode(["topics" => $categories]);
}

?>