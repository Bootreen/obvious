import { sql } from "@vercel/postgres";

import createUserQuery from "@/backend/sql-queries/user-create.sql";
import getUserQuery from "@/backend/sql-queries/user-get.sql";
import updateUserQuery from "@/backend/sql-queries/user-update.sql";
import deleteUserQuery from "@/backend/sql-queries/user-delete.sql";

export const createUser = async (
  id: string,
  username: string,
  email: string,
) => {
  await sql.query(createUserQuery, [id, username, email]);
};

export const getUser = async (id: string) => {
  const result = await sql.query(getUserQuery, [id]);

  return result.rows[0];
};

export const updateUser = async (
  id: string,
  username: string,
  email: string,
) => {
  await sql.query(updateUserQuery, [username, email, id]);
};

export const deleteUser = async (id: string) => {
  await sql.query(deleteUserQuery, [id]);
};
