<?php
// Supabase REST client helper for PHP

function get_config() {
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }
    return $config;
}

function send_cors_headers($methods = 'GET, POST, PUT, DELETE, OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: ' . $methods);
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json; charset=utf-8');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function trigger_restore() {
    static $restoreTriggered = false;
    if ($restoreTriggered) return;

    $config = get_config();
    $projectRef = $config['project_ref'] ?? '';
    $restoreUrl = $config['restore_url'] ?? '';

    if (empty($projectRef) || empty($restoreUrl)) return;

    $restoreTriggered = true;
    $ch = curl_init($restoreUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['project_ref' => $projectRef]));
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    @curl_exec($ch);
    curl_close($ch);
}

function get_json_body() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Execute request against Supabase PostgREST API
 */
function supabase_request($method, $table, $params = [], $body = null, $single = false) {
    $config = get_config();
    $baseUrl = rtrim($config['supabase_url'], '/') . '/rest/v1/' . ltrim($table, '/');

    // Build query string manually if params provided
    if (!empty($params)) {
        $parts = [];
        foreach ($params as $k => $v) {
            $parts[] = urlencode($k) . '=' . urlencode($v);
        }
        $baseUrl .= (strpos($baseUrl, '?') === false ? '?' : '&') . implode('&', $parts);
    }

    $headers = [
        'apikey: ' . $config['supabase_key'],
        'Authorization: Bearer ' . $config['supabase_key'],
        'Content-Type: application/json',
    ];

    $upperMethod = strtoupper($method);
    if (in_array($upperMethod, ['POST', 'PUT', 'PATCH'])) {
        $headers[] = 'Prefer: return=representation';
    }

    $ch = curl_init($baseUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $upperMethod);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    if ($body !== null && in_array($upperMethod, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
        $payload = is_string($body) ? $body : json_encode($body);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($httpCode >= 500) {
        trigger_restore();
    }

    if ($response === false) {
        return [
            'status' => 500,
            'data' => ['error' => 'cURL error: ' . $curlError],
        ];
    }

    $decoded = json_decode($response, true);
    if ($decoded === null && $httpCode >= 200 && $httpCode < 300) {
        // e.g. 204 No Content
        return ['status' => $httpCode, 'data' => ['ok' => true]];
    }

    if ($single && is_array($decoded) && isset($decoded[0]) && count($decoded) === 1) {
        $decoded = $decoded[0];
    }

    return [
        'status' => $httpCode,
        'data' => $decoded,
    ];
}
