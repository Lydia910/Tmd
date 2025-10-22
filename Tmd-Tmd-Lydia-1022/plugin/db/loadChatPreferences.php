<?php
require_once 'connect.php';
require_once 'db.function.php';

header('Content-Type: application/json');

$prefs = loadChatPreferences();
echo json_encode($prefs);

