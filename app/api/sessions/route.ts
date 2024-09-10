import { NextResponse } from "next/server";

import { dbError } from "@/types";
import {
  createSessionInDb,
  getSessionFromDb,
  deleteSessionFromDb,
  getSessionsByUserIdFromDb,
} from "@/backend/db-service/sessions";

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  try {
    const session = await createSessionInDb(userId);

    return NextResponse.json({
      data: session.id,
      status: 201,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to create session: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const GET = async (req: Request) => {
  // Get params from url
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = url.searchParams.get("userId");

  try {
    if (id) {
      // Fetch a single session by session ID
      const session = await getSessionFromDb(Number(id));

      return NextResponse.json({ data: session, status: 200, isError: false });
    } else if (userId) {
      // Fetch all sessions by user ID
      const sessions = await getSessionsByUserIdFromDb(userId);

      return NextResponse.json({
        data: sessions,
        status: 200,
        isError: false,
      });
    } else {
      throw { status: 400, message: "Session ID or User ID is required" };
    }
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to fetch session(s): internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  try {
    await deleteSessionFromDb(Number(id));

    return NextResponse.json({
      data: { message: "Session deleted successfully" },
      status: 200,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to delete session: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};
