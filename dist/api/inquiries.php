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

        $res = supabase_request('GET', 'inquiries', $params);
        http_response_code($res['status']);
        echo json_encode($res['data'] ?? []);
        exit;
    }

    if ($method === 'POST') {
        $payload = get_json_body();
        if (isset($payload['id']) && empty($payload['id'])) {
            unset($payload['id']);
        }
        $res = supabase_request('POST', 'inquiries', [], $payload, true);
        http_response_code($res['status'] >= 200 && $res['status'] < 300 ? 201 : $res['status']);
        echo json_encode($res['data']);
        exit;
    }

    if ($method === 'DELETE') {
        $payload = get_json_body();
        $id = $payload['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Inquiry id is required']);
            exit;
        }
        $res = supabase_request('DELETE', 'inquiries', ['id' => 'eq.' . $id]);
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
