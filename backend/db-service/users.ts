import { sql } from "@vercel/postgres";

import { User } from "@/types/index";
import createUserQuery from "@/backend/sql-queries/user-create.sql";
import getUserQuery from "@/backend/sql-queries/user-get.sql";
import updateUserQuery from "@/backend/sql-queries/user-update.sql";
import deleteUserQuery from "@/backend/sql-queries/user-delete.sql";

export const getUserFromDb = async (id: string): Promise<User> => {
  const result = await sql.query(getUserQuery, [id]);

  if (result.rows.length === 0) {
    throw { message: "User not found", status: 404 };
  }

  return result.rows[0];
};

export const createUserInDb = async (
  id: string,
  username: string,
  email: string,
): Promise<void> => {
  // Check if the user already exists without throwing 404 error if not found
  const existingUser = await getUserFromDb(id).catch(() => null);

  if (existingUser) {
    // User already exists, throwing error
    throw { message: "User with this ID already exists", status: 400 };
  }

  // Create a new user
  await sql.query(createUserQuery, [id, username, email]);
};

export const updateUserInDb = async (
  id: string,
  username: string,
  email: string,
): Promise<void> => {
  // Check if the user exists
  await getUserFromDb(id);

  // Proceed with the update
  await sql.query(updateUserQuery, [username, email, id]);
};

export const deleteUserFromDb = async (id: string): Promise<void> => {
  // Check if the user exists
  await getUserFromDb(id);

  // Proceed with the delete
  await sql.query(deleteUserQuery, [id]);
};
