<?php
// ---------------------POST/GET-------------
define("POST","POST");
define("JSON_APPICATION",'Content-Type: application/json');
define("PHP_INPUT",'php://input');


//-----------------------ERRORS------------
define("CURL_ERROR", "cURL Error: ");
define("API_ERROR", "API Error: ");
define("CONNECTION_ERROR","Connection failed: ");


//------------------------LOGS--------------------
define("CUSTOMER_LOGIN_ACTION",'Customer Login');
define("CUSTOMER_LOGIN_DETAILS",'Customer Login');

define("CUSTOMER_LOGOUT_ACTION",'Customer Logout');
define("CUSTOMER_LOGOUT_DETAILS",'Customer logged out');

define("CUSTOMER_REGIST_ACTION", 'Create User Info');
define("CUSTOMER_REGIST_DETAILS", 'User regeistration');



// ------------------------REDIRECT-----------------------
define("GO_TO_LOGIN_PAGE","Location: ../login.html");
define("GO_TO_CHATBOT_PAGE","Location: ../111.html");



//-----------------------DATA----------------------
define("FAQ_DATA","../data/faq_with_regex_synonyms_multilingual.json");
define("KEYWORD_DATA","../data/keyword_category_action.json");