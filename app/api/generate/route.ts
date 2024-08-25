/* eslint-disable no-console */
import events from "events";

import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

interface RequestData {
  body: string;
}

// Walkaround for free VPN usage
events.EventEmitter.defaultMaxListeners = 20;

let genAI: GoogleGenerativeAI | null = null;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    if (!genAI) {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    }
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const data: RequestData = await req.json();
    const prompt = data.body;
    const result: GenerateContentResult = await model.generateContent(prompt);
    const output = result.response.text() || "No content available";

    return NextResponse.json({ output });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
