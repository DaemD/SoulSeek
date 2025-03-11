import "@/lib/global";  // ✅ Import global variable
import { NextResponse } from "next/server";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "";

  if (!globalThis.humeProcess || globalThis.humeProcess.exitCode !== null) {
    console.log(`Starting session with mode: ${mode}`);

    const cmd = ["python", "backend/hume_ai_script.py"];
    if (mode) cmd.push(mode);

    try {
      globalThis.humeProcess = spawn(cmd[0], cmd.slice(1), { stdio: "pipe" });

      globalThis.humeProcess.stdout.on("data", (data: Buffer) =>
        console.log(`stdout: ${data.toString()}`)
      );

      globalThis.humeProcess.stderr.on("data", (data: Buffer) =>
        console.error(`stderr: ${data.toString()}`)
      );

      return NextResponse.json({ status: "started", message: `Hume AI session started with mode: ${mode}!` });
    } catch (error: any) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ status: "running", message: "Hume AI session is already running." });
  }
}
