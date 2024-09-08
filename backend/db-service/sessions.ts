import { sql } from "@vercel/postgres";

import createSessionQuery from "@/backend/sql-queries/session-create.sql";
import getSessionQuery from "@/backend/sql-queries/session-get.sql";
import deleteSessionQuery from "@/backend/sql-queries/session-delete.sql";

export const createSession = async () => {
  const result = await sql.query(createSessionQuery);

  return result.rows[0].id;
};

export const getSession = async (id: number) => {
  const result = await sql.query(getSessionQuery, [id]);

  return result.rows[0];
};

export const deleteSession = async (id: number) => {
  await sql.query(deleteSessionQuery, [id]);
};
