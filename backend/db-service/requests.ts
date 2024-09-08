import { sql } from "@vercel/postgres";

import createRequestQuery from "@/backend/sql-queries/request-create.sql";
import getRequestQuery from "@/backend/sql-queries/request-get.sql";
import updateRequestQuery from "@/backend/sql-queries/request-update.sql";
import deleteRequestQuery from "@/backend/sql-queries/request-delete.sql";

export const createRequest = async (requestData: string) => {
  const result = await sql.query(createRequestQuery, [requestData]);

  return result.rows[0].id;
};

export const getRequest = async (id: number) => {
  const result = await sql.query(getRequestQuery, [id]);

  return result.rows[0];
};

export const updateRequest = async (id: number, requestData: string) => {
  await sql.query(updateRequestQuery, [requestData, id]);
};

export const deleteRequest = async (id: number) => {
  await sql.query(deleteRequestQuery, [id]);
};
