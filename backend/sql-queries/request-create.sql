INSERT INTO so_requests (session_id, request_data)
VALUES ($1, $2)
RETURNING id;