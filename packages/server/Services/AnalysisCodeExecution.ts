import { spawn } from "node:child_process";
import fs from "node:fs";
import type { ILog, TGenericID } from "@tago-io/tcore-sdk/types";
import { invokeFilesystemFunction } from "../Plugins/invokeFilesystemFunction.ts";
import { io } from "../Socket/SocketServer.ts";
import { addAnalysisLog, editAnalysis, getAnalysisInfo } from "./Analysis.ts";
import { getMainSettings } from "./Settings.ts";

/**
 * Adds a log into the log buffer of the application and triggers the socket
 * event for all sockets attached with the `analysis:ID` resource.
 */
function addLog(error: boolean, id: TGenericID, message: string): void {
  const data: ILog = {
    error,
    message,
    timestamp: new Date(),
  };

  io.to(`analysis#${id}`).emit("analysis::console", data);

  addAnalysisLog(id, data);
}

/**
 * Runs an analysis script.
 * @param {TGenericID} id The ID of the analysis.
 * @param {any} data The data to be passed to the analysis' script.
 */
export async function runAnalysis(id: string, data: any): Promise<void> {
  const analysis = await getAnalysisInfo(id);
  const settings = await getMainSettings();

  try {
    if (!analysis.active) {
      const message = `The analysis is deactivated and can't run. To run the analysis activate it.`;
      throw new Error(message);
    }
    if (!analysis.binary_path) {
      const message = "Binary executable path is missing";
      throw new Error(message);
    }

    let filePath: string | null = null;
    if (analysis.file_path) {
      const resolvedPath = await invokeFilesystemFunction(
        "resolveFile",
        analysis.file_path,
      );
      if (!fs.existsSync(resolvedPath)) {
        const message = `File path doesn't exist: ${resolvedPath}`;
        throw new Error(message);
      }
      filePath = resolvedPath;
    }

    addLog(false, id, `Starting analysis ${id}`);

    const localAddress = `http://localhost:${settings.port}`;

    const args = filePath ? [filePath] : [];
    const child = spawn(`${analysis.binary_path}`, args, {
      env: {
        T_ANALYSIS_CONTEXT: "tago-io",
        T_ANALYSIS_ENV: stringifySafe(analysis.variables || []),
        T_ANALYSIS_DATA: stringifySafe(data),
        T_ANALYSIS_TOKEN: "",
        T_ANALYSIS_ID: analysis.id,
        TAGOIO_API: localAddress,
        TAGO_API: localAddress,
      },
    }).on("error", (err) => {
      const ex = err?.message || err?.toString?.();
      addLog(true, id, `Error while spawning the script: ${ex}`);
    });

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (data) => {
      addLog(false, id, data);
    });

    child.stderr.on("data", (data) => {
      addLog(true, id, data);
    });

    child.on("close", (code) => {
      addLog(false, id, `Finishing script execution with code ${code}`);
      clearTimeout(timeout);
    });

    const timeout = setTimeout(() => {
      addLog(true, id, "Script execution took too long (60s)");
      child.kill();
    }, 60 * 1000);

    editAnalysis(id, { last_run: new Date() });
  } catch (ex: any) {
    addLog(true, id, `${ex?.message || ex}`);
  }
}

/**
 * Safely stringifies an object. If the object cannot be stringified, `undefined` will be returned.
 */
function stringifySafe(data: any) {
  try {
    return JSON.stringify(data);
  } catch (ex) {
    return undefined;
  }
}
