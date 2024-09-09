import { NextResponse } from "next/server";

import { dbError } from "@/types";
import {
  createUserInDb,
  getUserFromDb,
  updateUserInDb,
  deleteUserFromDb,
} from "@/backend/db-service/users";

export const POST = async (req: Request) => {
  // Get params from request body
  const { id, username, email } = await req.json();

  try {
    await createUserInDb(id, username, email);

    return NextResponse.json({
      data: { message: "User created successfully" },
      status: 201,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to create user: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const GET = async (req: Request) => {
  // Get params from URL search params
  const id = new URL(req.url).searchParams.get("id");

  try {
    if (!id) {
      throw { status: 400, message: "User ID is required" };
    }

    const user = await getUserFromDb(id);

    return NextResponse.json({ data: user, status: 200, isError: false });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to fetch user: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const PATCH = async (req: Request) => {
  const { id, username, email } = await req.json();

  try {
    await updateUserInDb(id, username, email);

    return NextResponse.json({
      data: { message: "User updated successfully" },
      status: 200,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to update user: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  try {
    await deleteUserFromDb(id);

    return NextResponse.json({
      data: { message: "User deleted successfully" },
      status: 200,
      isError: false,
    });
  } catch (error) {
    return NextResponse.json({
      data: {
        error:
          (error as dbError).message ||
          "Failed to delete user: internal server error",
      },
      status: (error as dbError).status || 500,
      isError: true,
    });
  }
};
