INSERT INTO so_sessions (user_id)
VALUES ($1)
RETURNING id;