<?php

// 1. CAPTURE THE REQUESTING ORIGIN
$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

// 2. APPLY CORS HEADERS TO ALL RESPONSES (Fixes 422/500 stripping headers)
if (!empty($httpOrigin)) {
    header("Access-Control-Allow-Origin: $httpOrigin");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Accept');
header('Access-Control-Allow-Credentials: true');

// 3. KILL PREFLIGHTS IMMEDIATELY
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

// 4. HAND OVER TO LARAVEL NORMAL FLOW
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());