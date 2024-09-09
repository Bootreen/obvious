import { sql } from "@vercel/postgres";

import { SessionDetail } from "@/types";
import createSessionQuery from "@/backend/sql-queries/session-create.sql";
import getSessionQuery from "@/backend/sql-queries/session-get.sql";
import deleteSessionQuery from "@/backend/sql-queries/session-delete.sql";

export const getSessionFromDb = async (id: number): Promise<SessionDetail> => {
  const result = await sql.query(getSessionQuery, [id]);

  if (result.rows.length === 0) {
    throw { message: "Session not found", status: 404 };
  }

  return result.rows[0];
};

export const createSessionInDb = async (
  userId: string,
): Promise<SessionDetail> => {
  const result = await sql.query(createSessionQuery, [userId]);

  return result.rows[0];
};

export const deleteSessionFromDb = async (id: number): Promise<void> => {
  const existingSession = await getSessionFromDb(id);

  if (!existingSession) {
    throw { message: "Session not found", status: 404 };
  }

  await sql.query(deleteSessionQuery, [id]);
};
