/* eslint-disable no-console */
import { NextResponse } from "next/server";

import {
  createSession,
  getSession,
  // updateSession,
  deleteSession,
} from "@/backend/db-service/sessions";

export const POST = async (req: Request) => {
  const { id, login_time } = await req.json();

  try {
    // await createSession(id, login_time);

    return NextResponse.json({ message: "Session created successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const GET = async (req: Request) => {
  const { id } = await req.json();

  try {
    const session = await getSession(id);

    if (session) {
      return NextResponse.json(session);
    } else {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  const { id, login_time } = await req.json();

  try {
    // await updateSession(id, login_time);

    return NextResponse.json({ message: "Session updated successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  try {
    await deleteSession(id);

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
