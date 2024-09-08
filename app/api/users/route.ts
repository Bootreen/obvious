/* eslint-disable no-console */
import { NextResponse } from "next/server";

import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "@/utils/db-user-service";

export const POST = async (req: Request) => {
  const { id, username, email } = await req.json();

  try {
    await createUser(id, username, email);

    return NextResponse.json({ message: "User created successfully" });
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
    const user = await getUser(id as string);

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
  const { id, username, email } = await req.json();

  try {
    await updateUser(id, username, email);

    return NextResponse.json({ message: "User updated successfully" });
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
    await deleteUser(id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server errord" },
      { status: 500 },
    );
  }
};
