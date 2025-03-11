import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use async for better performance
import path from "path";

const LOG_FILE_PATH = path.join(process.cwd(), "backend/conversation_log.txt");

export async function GET() {
  try {
    // Force re-reading the file by preventing caching
    const conversation = await fs.readFile(LOG_FILE_PATH, "utf-8");

    return new NextResponse(
      JSON.stringify({ conversation }),
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error reading conversation log:", error);
    return NextResponse.json({ error: "Failed to read conversation log." }, { status: 500 });
  }
}
