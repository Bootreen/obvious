import { NextResponse } from "next/server";

import { dbError } from "@/types";
import {
  createRequestInDb,
  getRequestFromDb,
  updateRequestInDb,
  deleteRequestFromDb,
  getRequestsBySessionIdFromDb,
} from "@/backend/db-service/requests";

export const POST = async (req: Request) => {
  const { sessionId, requestData } = await req.json();

  try {
    const requestId = await createRequestInDb(sessionId, requestData);

    return NextResponse.json({
      data: { id: requestId },
      status: 201,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to create request: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const sessionId = url.searchParams.get("sessionId");

  try {
    if (id) {
      // Fetch a single request by request ID
      const request = await getRequestFromDb(Number(id));

      return NextResponse.json({ data: request, status: 200, isError: false });
    } else if (sessionId) {
      // Fetch all requests by session ID
      const requests = await getRequestsBySessionIdFromDb(Number(sessionId));

      return NextResponse.json({
        data: { requests },
        status: 200,
        isError: false,
      });
    } else {
      throw { status: 400, message: "Request ID or Session ID is required" };
    }
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to fetch request(s): internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const PATCH = async (req: Request) => {
  const { id, requestData } = await req.json();

  try {
    await updateRequestInDb(id, requestData);

    return NextResponse.json({
      data: { message: "Request updated successfully" },
      status: 200,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to update request: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  try {
    await deleteRequestFromDb(Number(id));

    return NextResponse.json({
      data: { message: "Request deleted successfully" },
      status: 200,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to delete request: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};
