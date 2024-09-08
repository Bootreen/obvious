/* eslint-disable no-console */
import { sql } from "@vercel/postgres";

import createTablesQuery from "@/sql/tables-init.sql";

export const createTables = async () => {
  try {
    await sql.query(createTablesQuery);
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
