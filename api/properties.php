<?php
require_once __DIR__ . '/db-client.php';

send_cors_headers('GET, POST, PUT, DELETE, OPTIONS');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $params = [
            'select' => '*',
            'order' => 'id.asc',
        ];

        if (!empty($_GET['city']) && $_GET['city'] !== 'All') {
            $params['city'] = 'eq.' . $_GET['city'];
        }
        if (!empty($_GET['society']) && $_GET['society'] !== 'All') {
            $params['society'] = 'eq.' . $_GET['society'];
        }
        if (!empty($_GET['type']) && $_GET['type'] !== 'All') {
            $params['type'] = 'eq.' . $_GET['type'];
        }
        if (!empty($_GET['status']) && $_GET['status'] !== 'All') {
            $params['status'] = 'eq.' . $_GET['status'];
        }
        if (!empty($_GET['search'])) {
            $search = $_GET['search'];
            $params['or'] = "(title.ilike.%{$search}%,location.ilike.%{$search}%,society.ilike.%{$search}%)";
        }

        $res = supabase_request('GET', 'properties', $params);
        http_response_code($res['status']);
        echo json_encode($res['data'] ?? []);
        exit;
    }

    if ($method === 'POST') {
        $payload = get_json_body();
        if (isset($payload['id']) && empty($payload['id'])) {
            unset($payload['id']);
        }
        $res = supabase_request('POST', 'properties', [], $payload, true);
        http_response_code($res['status'] >= 200 && $res['status'] < 300 ? 201 : $res['status']);
        echo json_encode($res['data']);
        exit;
    }

    if ($method === 'PUT') {
        $payload = get_json_body();
        $id = $payload['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Property id is required']);
            exit;
        }
        unset($payload['id']);
        $res = supabase_request('PATCH', 'properties', ['id' => 'eq.' . $id], $payload, true);
        http_response_code($res['status']);
        echo json_encode($res['data']);
        exit;
    }

    if ($method === 'DELETE') {
        $payload = get_json_body();
        $id = $payload['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Property id is required']);
            exit;
        }
        $res = supabase_request('DELETE', 'properties', ['id' => 'eq.' . $id]);
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
