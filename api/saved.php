<?php
require_once __DIR__ . '/db-client.php';

send_cors_headers('GET, POST, DELETE, OPTIONS');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $params = [
            'select' => '*',
            'order' => 'id.desc',
        ];

        if (!empty($_GET['session_id'])) {
            $params['session_id'] = 'eq.' . $_GET['session_id'];
        }

        $res = supabase_request('GET', 'saved_properties', $params);
        http_response_code($res['status']);
        echo json_encode($res['data'] ?? []);
        exit;
    }

    if ($method === 'POST') {
        $payload = get_json_body();
        if (isset($payload['id']) && empty($payload['id'])) {
            unset($payload['id']);
        }
        $res = supabase_request('POST', 'saved_properties', [], $payload, true);
        http_response_code($res['status'] >= 200 && $res['status'] < 300 ? 201 : $res['status']);
        echo json_encode($res['data']);
        exit;
    }

    if ($method === 'DELETE') {
        $payload = get_json_body();
        $id = $payload['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Saved property id is required']);
            exit;
        }
        $res = supabase_request('DELETE', 'saved_properties', ['id' => 'eq.' . $id]);
        if ($res['status'] >= 200 && $res['status'] < 300) {
            http_response_code(200);
            echo json_encode(['ok' => true]);
        } else {
            http_response_code($res['status']);
            echo json_encode($res['data']);
        }
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
