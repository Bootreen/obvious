import { NextResponse } from "next/server";

import { dbError } from "@/types";
import {
  createRequestInDb,
  getRequestFromDb,
  updateRequestInDb,
  deleteRequestFromDb,
} from "@/backend/db-service/requests";

export const POST = async (req: Request) => {
  const { sessionId, requestData } = await req.json();

  try {
    const requestId = await createRequestInDb(sessionId, requestData);

    return NextResponse.json({
      data: requestId,
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
  const id = new URL(req.url).searchParams.get("id");

  try {
    if (!id) {
      throw { status: 400, message: "Request ID is required" };
    }

    const request = await getRequestFromDb(Number(id));

    return NextResponse.json({ data: request, status: 200, isError: false });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to fetch request: internal server error",
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
