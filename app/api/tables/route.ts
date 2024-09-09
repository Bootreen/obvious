import { NextResponse } from "next/server";

import { createTablesInDb } from "@/backend/db-service/tables-setup";

export const POST = async () => {
  try {
    await createTablesInDb();

    return NextResponse.json({
      data: { message: "Tables created successfully (or already existed)" },
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      data: { error: "Failed to create tables: internal server error" },
      status: 500,
    });
  }
};
