/* eslint-disable no-console */
import { NextResponse } from "next/server";

import {
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
} from "@/backend/db-service/requests";

export const POST = async (req: Request) => {
  const { request } = await req.json();

  try {
    await createRequest(request);

    return NextResponse.json({ message: "Request created successfully" });
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
    const request = await getRequest(id);

    if (request) {
      return NextResponse.json(request);
    } else {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
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
  const { id, request } = await req.json();

  try {
    await updateRequest(id, request);

    return NextResponse.json({ message: "Request updated successfully" });
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
    await deleteRequest(id);

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
