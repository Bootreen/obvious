SELECT id, session_id, request_data, created_at
FROM so_requests
WHERE session_id = $1;