import "@/lib/global";  // ✅ Import global variable
import { NextResponse } from "next/server";

export async function GET() {
  if (globalThis.humeProcess && globalThis.humeProcess.exitCode === null) {
    console.log("Stopping AI session");
    globalThis.humeProcess.kill("SIGTERM");
    globalThis.humeProcess = null;
    return NextResponse.json({ status: "stopped", message: "Hume AI session stopped!" });
  } else {
    return NextResponse.json({ status: "not_running", message: "Hume AI session is not running." });
  }
}
