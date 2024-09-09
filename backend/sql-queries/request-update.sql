UPDATE so_requests
SET request_data = $1,
    created_at = CURRENT_TIMESTAMP
WHERE id = $2
