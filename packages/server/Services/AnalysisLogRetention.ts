import { ANALYSIS_LOG_RETENTION_CALL_LIMIT } from "@tago-io/tcore-sdk/types";
import { logError } from "../Helpers/log.ts";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import { getAnalysisList } from "./Analysis.ts";

/**
 * Amount of log lines each analysis keeps when `TCORE_ANALYSIS_LOG_MAX_LINES` is unset or empty.
 */
const DEFAULT_MAX_LINES = 1000;

/**
 * Time between two retention cycles, in milliseconds.
 */
const RETENTION_INTERVAL = 1000 * 60 * 10;

/**
 * Errors thrown by a database plugin that does not implement `applyAnalysisLogRetention`.
 * The first comes from the SDK's `DatabaseModule`, the second from plugins built with an SDK older than the method.
 */
const NOT_IMPLEMENTED_ERRORS = [
  "Method not implemented",
  "Function applyAnalysisLogRetention is not implemented",
];

/**
 * Interval that runs the retention cycles.
 */
let interval: ReturnType<typeof setInterval> | undefined;

let checkingLogRetention = false;

/**
 * Reads the amount of log lines each analysis keeps from `TCORE_ANALYSIS_LOG_MAX_LINES`.
 * An unset or empty variable means the default, as with the other `TCORE_*` variables.
 * Throws when the variable is set to anything other than a positive integer.
 */
export function getAnalysisLogMaxLines(): number {
  const value = process.env.TCORE_ANALYSIS_LOG_MAX_LINES;
  if (!value) {
    return DEFAULT_MAX_LINES;
  }

  const maxLines = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(maxLines) || maxLines < 1) {
    throw new Error(
      `TCORE_ANALYSIS_LOG_MAX_LINES must be a positive integer, received "${value}"`,
    );
  }

  return maxLines;
}

function getErrorMessage(ex: any): string {
  return ex?.message || ex?.toString?.() || ex;
}

/**
 * Deletes all but the newest `maxLines` logs of one analysis.
 * Each call removes at most `ANALYSIS_LOG_RETENTION_CALL_LIMIT` logs, so the plugin is called again until a call
 * removes less. A plugin that resolves to anything other than a number is called once.
 */
async function trimAnalysisLogs(
  analysisID: string,
  maxLines: number,
): Promise<void> {
  let removed: unknown;
  do {
    removed = await invokeDatabaseFunction(
      "applyAnalysisLogRetention",
      analysisID,
      { max_lines: maxLines },
    );
  } while (
    typeof removed === "number" &&
    removed >= ANALYSIS_LOG_RETENTION_CALL_LIMIT
  );
}

/**
 * Deletes all but the newest `maxLines` logs of every analysis, one analysis at a time.
 * A failure on one analysis is logged and the cycle moves on to the next one.
 * Ends the cycle silently when the database plugin does not implement log retention.
 */
export async function triggerAnalysisLogRetentionCheck(
  maxLines: number,
): Promise<void> {
  if (checkingLogRetention) {
    // lock to prevent overlapping cycles
    return;
  }

  checkingLogRetention = true;

  try {
    const analyses = await getAnalysisList({
      fields: ["id"],
      amount: 999999,
    }).catch((ex) => {
      logError(
        "api",
        `Analysis log retention could not list the analyses: ${getErrorMessage(ex)}`,
      );
      return null;
    });

    if (!analyses) {
      return;
    }

    for (const analysis of analyses) {
      try {
        await trimAnalysisLogs(analysis.id, maxLines);
      } catch (ex: any) {
        const err = getErrorMessage(ex);
        if (NOT_IMPLEMENTED_ERRORS.includes(err)) {
          return;
        }
        logError(
          "api",
          `Analysis log retention failed for analysis ${analysis.id}: ${err}`,
        );
      }
    }
  } finally {
    checkingLogRetention = false;
  }
}

/**
 * Starts the analysis log retention cycles, keeping the newest `maxLines` logs of each analysis.
 */
export function startAnalysisLogRetentionTimer(maxLines: number): void {
  stopAnalysisLogRetentionTimer();
  interval = setInterval(
    () => triggerAnalysisLogRetentionCheck(maxLines),
    RETENTION_INTERVAL,
  );
}

/**
 * Stops the analysis log retention cycles.
 */
export function stopAnalysisLogRetentionTimer(): void {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
}
