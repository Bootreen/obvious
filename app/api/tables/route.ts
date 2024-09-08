/* eslint-disable no-console */
import { NextResponse } from "next/server";

import { createTables } from "@/utils/db-setup-tables";

// API Route Handler
export const POST = async () => {
  try {
    await createTables();

    return NextResponse.json({ message: "Tables created successfully" });
  } catch (error) {
    console.error("Error in API route:", error);

    return NextResponse.json(
      { error: "Failed to create tables" },
      { status: 500 },
    );
  }
};
