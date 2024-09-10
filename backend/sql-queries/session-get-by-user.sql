SELECT id, user_id, created_at
FROM so_sessions
WHERE user_id = $1;