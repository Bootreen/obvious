/* eslint-disable no-console */
import { sql } from "@vercel/postgres";

import createTablesQuery from "@/sql/tables-init.sql";

console.log(createTablesQuery);

export const createTables = async () => {
  try {
    await sql.query(createTablesQuery);
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
