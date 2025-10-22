<?php
require_once 'config.php';

function getAIResponse($msg){
  header('Content-Type: application/json');

  // Read user message
  // $input = json_decode(file_get_contents('php://input'), true);
  $message = $msg ?? '';

  if (!$message) {
      echo json_encode(['response' => 'No message received.']);
      exit;
  }

  // Perplexity API endpoint (example for chat completions)
  $apiUrl = 'https://api.perplexity.ai/chat/completions'; 

  $payload = [
      "model" => "gpt-5",  
      "messages" => [
          ["role" => "user", "content" => $message]
      ]

  ];

  $curl = curl_init();

  curl_setopt_array($curl, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
      "Authorization: " . "Bearer " . PERPLEXITY_API_KEY,
      "Content-Type: application/json"
    ],
  ]);

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  }


  $data = json_decode($response, true);

  $reply = $data['choices'][0]['message']['content'] 
        ?? $data['output'][0]['content'] 
        ?? 'No response.';
  if (isset($data['error'])) {
      $reply = "API Error: " . $data['error']['message'];
  }
return $reply;

}

