import { sql } from "@vercel/postgres";

import createTablesQuery from "@/backend/sql-queries/tables-init.sql";

export const createTablesInDb = async (): Promise<void> => {
  try {
    await sql.query(createTablesQuery);
  } catch (error) {
    throw error;
  }
};
