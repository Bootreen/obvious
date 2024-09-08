/* eslint-disable no-console */
import { NextResponse } from "next/server";

import { createTables } from "@/backend/db-service/tables-setup";

export const POST = async () => {
  try {
    await createTables();

    return NextResponse.json({ message: "Tables created successfully" });
  } catch (error) {
    console.error("Error in API route:", error);

    return NextResponse.json(
      { error: "Internal server error: failed to create tables" },
      { status: 500 },
    );
  }
};
