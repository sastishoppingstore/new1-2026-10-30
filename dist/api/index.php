<?php
// Central API router fallback for Apache rewrites

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
$parts = array_filter(explode('/', trim($uri, '/')));
$endpoint = end($parts);

// Strip .php extension if present
$endpoint = preg_replace('/\.php$/', '', $endpoint);

switch ($endpoint) {
    case 'properties':
        require __DIR__ . '/properties.php';
        break;
    case 'inquiries':
        require __DIR__ . '/inquiries.php';
        break;
    case 'saved':
        require __DIR__ . '/saved.php';
        break;
    default:
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Endpoint not found: ' . $endpoint]);
        break;
}
