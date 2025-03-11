import { ChildProcessWithoutNullStreams } from "child_process";

// Declare global variable type
declare global {
  var humeProcess: ChildProcessWithoutNullStreams | null;
}

// Ensure global persistence
globalThis.humeProcess = globalThis.humeProcess || null;

export {};
