import { sql } from "@vercel/postgres";

import createRequestQuery from "@/sql/request-create.sql";
import getRequestQuery from "@/sql/request-get.sql";
import updateRequestQuery from "@/sql/request-update.sql";
import deleteRequestQuery from "@/sql/request-delete.sql";

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
