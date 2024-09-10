import { sql } from "@vercel/postgres";

import { RequestData, RequestDetail } from "@/types";
import createRequestQuery from "@/backend/sql-queries/request-create.sql";
import getRequestQuery from "@/backend/sql-queries/request-get.sql";
import updateRequestQuery from "@/backend/sql-queries/request-update.sql";
import deleteRequestQuery from "@/backend/sql-queries/request-delete.sql";
import getRequestBySessionIdQuery from "@/backend/sql-queries/request-get-by-session.sql";

export const getRequestFromDb = async (id: number): Promise<RequestDetail> => {
  const result = await sql.query(getRequestQuery, [id]);

  if (result.rows.length === 0) {
    throw { message: "Request not found", status: 404 };
  }

  return result.rows[0];
};

export const getRequestsBySessionIdFromDb = async (
  sessionId: number,
): Promise<RequestDetail[]> => {
  const result = await sql.query(getRequestBySessionIdQuery, [sessionId]);

  if (result.rows.length === 0) {
    throw { message: "No requests found for this session", status: 404 };
  }

  return result.rows;
};

export const createRequestInDb = async (
  sessionId: number,
  requestData: string,
): Promise<number> => {
  // Check if the request already exists without throwing 404 error if not found
  const existingRequest = await sql
    .query(getRequestQuery, [sessionId])
    .catch(() => null);

  if (existingRequest) {
    throw { message: "Request with this data already exists", status: 400 };
  }

  const result = await sql.query(createRequestQuery, [sessionId, requestData]);

  return result.rows[0].id;
};

export const updateRequestInDb = async (
  id: number,
  requestData: RequestData,
): Promise<void> => {
  await getRequestFromDb(id);
  await sql.query(updateRequestQuery, [requestData, id]);
};

export const deleteRequestFromDb = async (id: number): Promise<void> => {
  await getRequestFromDb(id);
  await sql.query(deleteRequestQuery, [id]);
};
